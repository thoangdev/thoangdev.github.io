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
    var TURNSTILE_PLACEHOLDER = '__TURNSTILE_SITE_KEY__';

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

    function parseResponsePayload(payload) {
        if (!payload) return '';

        if (typeof payload === 'string') {
            try {
                return parseResponsePayload(JSON.parse(payload));
            } catch (error) {
                return payload;
            }
        }

        if (typeof payload === 'object') {
            if (Array.isArray(payload.errors) && payload.errors.length) {
                return payload.errors
                    .map(function (entry) {
                        if (!entry) return '';
                        if (typeof entry === 'string') return entry;
                        return entry.message || entry.error || entry.code || '';
                    })
                    .filter(Boolean)
                    .join(' ');
            }

            if (typeof payload._status === 'string') {
                return payload._status;
            }

            return payload.error || payload.message || '';
        }

        return '';
    }

    function indicatesFailure(message) {
        return /(error|fail(?:ed|ure)?|spam|captcha|turnstile|blocked|invalid)/i.test(trimValue(message));
    }

    function getResponseFailureMessage(response) {
        return getResponseMessage(response).then(function (message) {
            return indicatesFailure(message) ? message : '';
        });
    }

    function getResponseMessage(response) {
        if (!response) {
            return Promise.resolve('');
        }

        if (typeof response.json === 'function') {
            return response.json()
                .then(parseResponsePayload)
                .catch(function () {
                    return '';
                });
        }

        if (typeof response.text === 'function') {
            return response.text()
                .then(parseResponsePayload)
                .catch(function () {
                    return '';
                });
        }

        return Promise.resolve('');
    }

    function requiresTurnstile(message) {
        return /turnstile/i.test(trimValue(message));
    }

    function isTurnstileSitekeyConfigured(sitekey) {
        return !!sitekey && sitekey.indexOf(TURNSTILE_PLACEHOLDER) === -1;
    }

    function setTurnstileError(turnstileState, message) {
        if (!turnstileState || !turnstileState.errorNode) {
            return;
        }

        turnstileState.errorNode.textContent = trimValue(message);
    }

    function clearTurnstileToken(turnstileState) {
        if (!turnstileState || !turnstileState.tokenField) {
            return;
        }

        turnstileState.tokenField.value = '';
        turnstileState.tokenField.removeAttribute('aria-invalid');
    }

    function resetTurnstile(turnstileState) {
        if (!turnstileState) {
            return;
        }

        clearTurnstileToken(turnstileState);
        setTurnstileError(turnstileState, '');

        if (turnstileState.api && typeof turnstileState.api.reset === 'function' && turnstileState.widgetId !== null) {
            turnstileState.api.reset(turnstileState.widgetId);
        }
    }

    function validateTurnstile(turnstileState) {
        if (!turnstileState || !turnstileState.isRequired) {
            return true;
        }

        if (trimValue(turnstileState.tokenField && turnstileState.tokenField.value)) {
            setTurnstileError(turnstileState, '');
            turnstileState.tokenField.removeAttribute('aria-invalid');
            return true;
        }

        if (turnstileState.tokenField) {
            turnstileState.tokenField.setAttribute('aria-invalid', 'true');
        }
        setTurnstileError(turnstileState, 'Please complete the verification.');
        return false;
    }

    function initTurnstile(doc, options) {
        var container = doc.getElementById('cf-turnstile-widget');
        var tokenField = doc.getElementById('cf-turnstile-response');
        var errorNode = doc.getElementById('cf-turnstile-error');
        var api = options.turnstile || globalRoot.turnstile;
        var sitekey = trimValue(container && container.getAttribute('data-sitekey'));
        var turnstileState = {
            api: api,
            container: container,
            errorNode: errorNode,
            isConfigured: false,
            isRequired: !!container,
            tokenField: tokenField,
            widgetId: null
        };

        if (!container) {
            return turnstileState;
        }

        if (!tokenField || !errorNode || !isTurnstileSitekeyConfigured(sitekey) || !api || typeof api.render !== 'function') {
            return turnstileState;
        }

        try {
            turnstileState.widgetId = api.render(container, {
                sitekey: sitekey,
                theme: trimValue(container.getAttribute('data-theme')) || 'light',
                callback: function (token) {
                    tokenField.value = token || '';
                    tokenField.removeAttribute('aria-invalid');
                    setTurnstileError(turnstileState, '');
                },
                'expired-callback': function () {
                    clearTurnstileToken(turnstileState);
                    setTurnstileError(turnstileState, 'Please complete the verification again.');
                },
                'error-callback': function () {
                    clearTurnstileToken(turnstileState);
                    setTurnstileError(turnstileState, 'Verification failed. Please try again.');
                }
            });
            turnstileState.isConfigured = true;
        } catch (error) {
            turnstileState.isConfigured = false;
        }

        return turnstileState;
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
        var turnstileState = initTurnstile(doc, options);

        if (!action || action.indexOf('__FORMSPREE') !== -1 || (turnstileState.isRequired && !turnstileState.isConfigured)) {
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

            if (!validateTurnstile(turnstileState)) {
                return;
            }

            setSubmitState(button, true);

            fetchImpl(action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormDataCtor(form)
            })
                .then(function (response) {
                    return getResponseFailureMessage(response).then(function (message) {
                        if (response && response.ok && !message) {
                            setSubmitState(button, false);
                            form.reset();
                            resetTurnstile(turnstileState);
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

                        if (requiresTurnstile(message)) {
                            setSubmitState(button, false);

                            if (turnstileState && turnstileState.isConfigured) {
                                resetTurnstile(turnstileState);
                                setTurnstileError(turnstileState, 'Please complete the verification and try again.');
                                return;
                            }

                            setStatusVisibility(doc, {
                                'cf-success': false,
                                'cf-error': false,
                                'cf-unconfigured': true
                            });
                            return;
                        }

                        setSubmitState(button, false);
                        setStatusVisibility(doc, {
                            'cf-success': false,
                            'cf-error': true,
                            'cf-unconfigured': false
                        });
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
        getResponseMessage: getResponseMessage,
        initContactForm: initContactForm,
        initTurnstile: initTurnstile,
        indicatesFailure: indicatesFailure,
        isTurnstileSitekeyConfigured: isTurnstileSitekeyConfigured,
        parseResponsePayload: parseResponsePayload,
        requiresTurnstile: requiresTurnstile,
        resetTurnstile: resetTurnstile,
        getResponseFailureMessage: getResponseFailureMessage,
        setStatusVisibility: setStatusVisibility,
        setSubmitState: setSubmitState,
        setTurnstileError: setTurnstileError,
        validateTurnstile: validateTurnstile,
        validateContactField: validateContactField,
        validateRequiredFields: validateRequiredFields
    };
});