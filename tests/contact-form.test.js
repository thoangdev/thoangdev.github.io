'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const contactForm = require('../js/contact-form.js');
const { FakeDocument, FakeElement, createEvent, flushPromises } = require('./helpers/dom-fakes.js');

function createField(options) {
    const errorNode = new FakeElement({ textContent: '' });
    const formGroup = new FakeElement({ querySelectorMap: { '.field-error': errorNode } });
    const field = new FakeElement({
        type: options.type,
        value: options.value,
        closestMap: { '.form-group': formGroup }
    });

    return { errorNode, field, formGroup };
}

function createContactFormDocument(action) {
    var options = arguments.length > 1 && arguments[1] ? arguments[1] : {};
    const withTurnstile = !!options.withTurnstile;
    const nameField = createField({ type: 'text', value: 'Jane Doe' });
    const emailField = createField({ type: 'email', value: 'jane@example.com' });
    const selectField = createField({ type: 'select-one', value: 'Job Opportunity' });
    const messageField = createField({ type: 'textarea', value: 'I would like to discuss the role.' });

    const submitLabel = new FakeElement({ hidden: false });
    const submitSpinner = new FakeElement({ hidden: true });
    const submitButton = new FakeElement({
        querySelectorMap: {
            '.submit-label': submitLabel,
            '.submit-spinner': submitSpinner
        }
    });

    const success = new FakeElement({ hidden: true });
    const error = new FakeElement({ hidden: true });
    const unconfigured = new FakeElement({ hidden: true });
    const turnstileWidget = withTurnstile
        ? new FakeElement({
            attributes: { 'data-sitekey': options.turnstileSitekey || '__TURNSTILE_SITE_KEY__', 'data-theme': 'light' }
        })
        : null;
    const turnstileToken = withTurnstile ? new FakeElement({ type: 'hidden', value: '' }) : null;
    const turnstileError = withTurnstile ? new FakeElement({ textContent: '' }) : null;

    const form = new FakeElement({ attributes: { action: action || 'https://formspree.io/f/xnjljodd' } });
    form.querySelectorAllMap = {
        '[required]': [nameField.field, emailField.field, selectField.field, messageField.field]
    };
    form.resetCalled = false;
    form.reset = function () {
        this.resetCalled = true;
    };

    const elementsById = {
        contactForm: form,
        'cf-submit': submitButton,
        'cf-success': success,
        'cf-error': error,
        'cf-unconfigured': unconfigured
    };

    if (withTurnstile) {
        elementsById['cf-turnstile-widget'] = turnstileWidget;
        elementsById['cf-turnstile-response'] = turnstileToken;
        elementsById['cf-turnstile-error'] = turnstileError;
    }

    const doc = new FakeDocument({ elementsById: elementsById });

    return {
        doc,
        form,
        fields: {
            nameField,
            emailField,
            selectField,
            messageField
        },
        status: { success, error, unconfigured },
        submit: { submitButton, submitLabel, submitSpinner },
        turnstile: { turnstileWidget, turnstileToken, turnstileError }
    };
}

test('validateRequiredFields returns required and email errors', function () {
    const blank = createField({ type: 'text', value: '   ' }).field;
    const invalidEmail = createField({ type: 'email', value: 'no-at-symbol' }).field;
    const valid = createField({ type: 'email', value: ' jane@example.com ' }).field;

    const results = contactForm.validateRequiredFields([blank, invalidEmail, valid]);

    assert.equal(results[0].error, 'This field is required.');
    assert.equal(results[1].error, 'Please enter a valid email address.');
    assert.equal(results[2].error, '');
});

test('initContactForm blocks unconfigured forms and shows warning state', function () {
    const { doc, form, status } = createContactFormDocument('__FORMSPREE__');

    contactForm.initContactForm(doc, {});
    form.dispatchEvent('submit', createEvent());

    assert.equal(status.unconfigured.hidden, false);
    assert.equal(status.success.hidden, true);
    assert.equal(status.error.hidden, true);
});

test('initContactForm blocks submission when Turnstile sitekey is not injected', function () {
    const { doc, form, status } = createContactFormDocument(undefined, { withTurnstile: true });

    contactForm.initContactForm(doc, {});
    form.dispatchEvent('submit', createEvent());

    assert.equal(status.unconfigured.hidden, false);
    assert.equal(status.success.hidden, true);
    assert.equal(status.error.hidden, true);
});

test('initContactForm applies validation errors to wrapped fields and skips fetch', async function () {
    const { doc, form, fields, status } = createContactFormDocument();
    const fetchCalls = [];

    fields.nameField.field.value = ' ';
    fields.emailField.field.value = 'bad-email';
    fields.selectField.field.value = '';
    fields.messageField.field.value = ' ';

    contactForm.initContactForm(doc, {
        fetch: function () {
            fetchCalls.push(true);
            return Promise.resolve({ ok: true });
        },
        FormData: function FakeFormData() {}
    });

    form.dispatchEvent('submit', createEvent());
    await flushPromises();

    assert.deepEqual(fetchCalls, []);
    assert.equal(fields.nameField.errorNode.textContent, 'This field is required.');
    assert.equal(fields.emailField.errorNode.textContent, 'Please enter a valid email address.');
    assert.equal(fields.selectField.errorNode.textContent, 'This field is required.');
    assert.equal(fields.messageField.errorNode.textContent, 'This field is required.');
    assert.equal(fields.nameField.field.getAttribute('aria-invalid'), 'true');
    assert.equal(status.success.hidden, true);
    assert.equal(status.error.hidden, true);
});

test('initContactForm handles successful submissions and analytics', async function () {
    const { doc, form, fields, status, submit, turnstile } = createContactFormDocument(undefined, {
        withTurnstile: true,
        turnstileSitekey: '1x00000000000000000000AA'
    });
    const analyticsCalls = [];
    const formDataCalls = [];
    const turnstileApi = {
        render: function (container, config) {
            config.callback('verified-token');
            this.widgetContainer = container;
            this.config = config;
            return 'widget-1';
        },
        reset: function (widgetId) {
            this.resetWidgetId = widgetId;
        }
    };

    contactForm.initContactForm(doc, {
        fetch: function () {
            return Promise.resolve({ ok: true });
        },
        FormData: function FakeFormData(arg) {
            formDataCalls.push(arg);
        },
        gtag: function () {
            analyticsCalls.push(Array.from(arguments));
        },
        turnstile: turnstileApi
    });

    form.dispatchEvent('submit', createEvent());

    assert.equal(submit.submitButton.disabled, true);
    assert.equal(submit.submitLabel.hidden, true);
    assert.equal(submit.submitSpinner.hidden, false);

    await flushPromises();

    assert.equal(submit.submitButton.disabled, false);
    assert.equal(submit.submitLabel.hidden, false);
    assert.equal(submit.submitSpinner.hidden, true);
    assert.equal(form.resetCalled, true);
    assert.deepEqual(formDataCalls, [form]);
    assert.equal(status.success.hidden, false);
    assert.equal(status.error.hidden, true);
    assert.equal(fields.emailField.errorNode.textContent, '');
    assert.equal(fields.emailField.field.getAttribute('aria-invalid'), null);
    assert.equal(turnstileApi.widgetContainer, turnstile.turnstileWidget);
    assert.equal(turnstileApi.resetWidgetId, 'widget-1');
    assert.equal(turnstile.turnstileToken.value, '');
    assert.deepEqual(analyticsCalls[0], ['event', 'contact_form_submit', { event_category: 'engagement' }]);
});

test('initContactForm treats ok responses with captcha errors as failures', async function () {
    const { doc, form, status, submit } = createContactFormDocument(undefined, {
        withTurnstile: true,
        turnstileSitekey: '1x00000000000000000000AA'
    });
    const analyticsCalls = [];

    contactForm.initContactForm(doc, {
        fetch: function () {
            return Promise.resolve({
                ok: true,
                json: function () {
                    return Promise.resolve({ error: 'Captcha failed' });
                }
            });
        },
        FormData: function FakeFormData() {},
        gtag: function () {
            analyticsCalls.push(Array.from(arguments));
        },
        turnstile: {
            render: function (container, config) {
                config.callback('verified-token');
                return 'widget-5';
            },
            reset: function () {}
        }
    });

    form.dispatchEvent('submit', createEvent());
    await flushPromises();

    assert.equal(submit.submitButton.disabled, false);
    assert.equal(status.success.hidden, true);
    assert.equal(status.error.hidden, false);
    assert.deepEqual(analyticsCalls, []);
});

test('initContactForm requires a completed Turnstile token before fetch', async function () {
    const { doc, form, turnstile } = createContactFormDocument(undefined, {
        withTurnstile: true,
        turnstileSitekey: '1x00000000000000000000AA'
    });
    const fetchCalls = [];
    let turnstileConfig;

    contactForm.initContactForm(doc, {
        fetch: function () {
            fetchCalls.push(true);
            return Promise.resolve({ ok: true });
        },
        FormData: function FakeFormData() {},
        turnstile: {
            render: function (container, config) {
                turnstileConfig = config;
                return 'widget-2';
            },
            reset: function () {}
        }
    });

    form.dispatchEvent('submit', createEvent());
    await flushPromises();

    assert.deepEqual(fetchCalls, []);
    assert.equal(turnstile.turnstileError.textContent, 'Please complete the verification.');

    turnstileConfig.callback('verified-token');
    form.dispatchEvent('submit', createEvent());
    await flushPromises();

    assert.equal(fetchCalls.length, 1);
});

test('initContactForm shows unconfigured warning when Formspree requires Turnstile without a local widget', async function () {
    const { doc, form, status } = createContactFormDocument();

    contactForm.initContactForm(doc, {
        fetch: function () {
            return Promise.resolve({
                ok: false,
                json: function () {
                    return Promise.resolve({ error: 'Please complete the Turnstile' });
                }
            });
        },
        FormData: function FakeFormData() {}
    });

    form.dispatchEvent('submit', createEvent());
    await flushPromises();

    assert.equal(status.unconfigured.hidden, false);
    assert.equal(status.success.hidden, true);
    assert.equal(status.error.hidden, true);
});

test('initContactForm restores button state on server and network failures', async function () {
    const serverCase = createContactFormDocument(undefined, {
        withTurnstile: true,
        turnstileSitekey: '1x00000000000000000000AA'
    });
    const serverTurnstile = {
        render: function (container, config) {
            config.callback('verified-token');
            return 'widget-3';
        },
        reset: function () {}
    };

    contactForm.initContactForm(serverCase.doc, {
        fetch: function () {
            return Promise.resolve({ ok: false });
        },
        FormData: function FakeFormData() {},
        turnstile: serverTurnstile
    });

    serverCase.form.dispatchEvent('submit', createEvent());
    await flushPromises();

    assert.equal(serverCase.submit.submitButton.disabled, false);
    assert.equal(serverCase.status.success.hidden, true);
    assert.equal(serverCase.status.error.hidden, false);

    const networkCase = createContactFormDocument(undefined, {
        withTurnstile: true,
        turnstileSitekey: '1x00000000000000000000AA'
    });
    const networkTurnstile = {
        render: function (container, config) {
            config.callback('verified-token');
            return 'widget-4';
        },
        reset: function () {}
    };

    contactForm.initContactForm(networkCase.doc, {
        fetch: function () {
            return Promise.reject(new Error('network error'));
        },
        FormData: function FakeFormData() {},
        turnstile: networkTurnstile
    });

    networkCase.form.dispatchEvent('submit', createEvent());
    await flushPromises();

    assert.equal(networkCase.submit.submitButton.disabled, false);
    assert.equal(networkCase.status.success.hidden, true);
    assert.equal(networkCase.status.error.hidden, false);
});