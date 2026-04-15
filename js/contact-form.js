(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
        return;
    }

    root.TommyPortfolioContactForm = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    var globalRoot = typeof globalThis !== 'undefined' ? globalThis : this;

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function trimValue(value) {
        return typeof value === 'string' ? value.trim() : '';
    }

    function getFieldErrorElement(field) {
        if (!field || typeof field.closest !== 'function') return null;

        var group = field.closest('.form-group');
        if (!group || typeof group.querySelector !== 'function') return null;
        return group.querySelector('.field-error');
    }

    function validateContactField(field) {
        var value = trimValue(field && field.value);

        if (!value) {
            return 'This field is required.';
        }

        if (field && field.type === 'email' && !EMAIL_PATTERN.test(value)) {
            return 'Please enter a valid email address.';
        }

        return '';
    }

    function validateRequiredFields(fields) {
        return fields.map(function (field) {
            return {
                field: field,
                error: validateContactField(field)
            };
        });
    }

    function applyValidationResults(results) {
        var valid = true;

        results.forEach(function (result) {
            var field = result.field;
            var error = result.error;
            var errorNode = getFieldErrorElement(field);

            if (error) {
                if (errorNode) {
                    errorNode.textContent = error;
                }
                field.setAttribute('aria-invalid', 'true');
                valid = false;
                return;
            }

            if (errorNode) {
                errorNode.textContent = '';
            }
            field.removeAttribute('aria-invalid');
        });

        return valid;
    }

    function setSubmitState(button, isSubmitting) {
        if (!button) return;

        var label = button.querySelector('.submit-label');
        var spinner = button.querySelector('.submit-spinner');

        button.disabled = isSubmitting;
        if (label) {
            label.hidden = isSubmitting;
        }
        if (spinner) {
            spinner.hidden = !isSubmitting;
        }
    }

    function setStatusVisibility(doc, states) {
        Object.keys(states).forEach(function (id) {
            var node = doc.getElementById(id);
            if (node) {
                node.hidden = !states[id];
            }
        });
    }

    function initContactForm(doc, options) {
        options = options || {};

        var form = doc.getElementById('contactForm');
        if (!form) return null;

        var fetchImpl = options.fetch || globalRoot.fetch;
        var FormDataCtor = options.FormData || globalRoot.FormData;
        var gtagImpl = options.gtag || globalRoot.gtag;
        var button = doc.getElementById('cf-submit');
        var action = form.getAttribute('action') || '';

        if (!action || action.indexOf('__FORMSPREE') !== -1) {
            setStatusVisibility(doc, {
                'cf-success': false,
                'cf-error': false,
                'cf-unconfigured': true
            });
            form.addEventListener('submit', function (event) {
                event.preventDefault();
            });
            return { form: form, isConfigured: false };
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var fields = Array.prototype.slice.call(form.querySelectorAll('[required]'));
            var results = validateRequiredFields(fields);

            setStatusVisibility(doc, {
                'cf-success': false,
                'cf-error': false,
                'cf-unconfigured': false
            });

            if (!applyValidationResults(results)) {
                return;
            }

            setSubmitState(button, true);

            fetchImpl(action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormDataCtor(form)
            })
                .then(function (response) {
                    setSubmitState(button, false);

                    if (response && response.ok) {
                        form.reset();
                        applyValidationResults(results.map(function (result) {
                            return { field: result.field, error: '' };
                        }));
                        setStatusVisibility(doc, {
                            'cf-success': true,
                            'cf-error': false,
                            'cf-unconfigured': false
                        });

                        if (typeof gtagImpl === 'function') {
                            gtagImpl('event', 'contact_form_submit', { event_category: 'engagement' });
                        }

                        return;
                    }

                    setStatusVisibility(doc, {
                        'cf-success': false,
                        'cf-error': true,
                        'cf-unconfigured': false
                    });
                })
                .catch(function () {
                    setSubmitState(button, false);
                    setStatusVisibility(doc, {
                        'cf-success': false,
                        'cf-error': true,
                        'cf-unconfigured': false
                    });
                });
        });

        return { form: form, isConfigured: true };
    }

    function autoInit() {
        if (!globalRoot.document) return;

        if (globalRoot.document.readyState === 'loading') {
            globalRoot.document.addEventListener('DOMContentLoaded', function () {
                initContactForm(globalRoot.document);
            });
            return;
        }

        initContactForm(globalRoot.document);
    }

    autoInit();

    return {
        EMAIL_PATTERN: EMAIL_PATTERN,
        applyValidationResults: applyValidationResults,
        getFieldErrorElement: getFieldErrorElement,
        initContactForm: initContactForm,
        setStatusVisibility: setStatusVisibility,
        setSubmitState: setSubmitState,
        validateContactField: validateContactField,
        validateRequiredFields: validateRequiredFields
    };
});