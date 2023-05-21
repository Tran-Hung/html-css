function Validator(options) {

    function getParent(inputElement, selector) {

        while (inputElement.parentElement) {
            if (inputElement.parentElement.matches(selector)) {
                return inputElement.parentElement
            }
            inputElement = inputElement.parentElement
        }
    }

    function validate(inputElement, rule) {
        var message = getParent(inputElement, options.formGroup).querySelector(options.errorSelector)
        var errorMessage;
        var rules = selectorRules[rule.selector];

        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](form.querySelector(rule.selector + ':checked'))
                    break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            message.innerText = errorMessage
            getParent(inputElement, options.formGroup).classList.add('invalid')
        }
        // else {
        //     message.innerText = ''
        //     getParent(inputElement, options.formGroup).classList.remove('invalid')
        // }

        return !errorMessage;
    }

    var selectorRules = {};

    var form = document.querySelector(options.form);
    
    if (form) {
        options.rules.forEach(rule => {
            
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }
            
            var inputElements = form.querySelectorAll(rule.selector)
            Array.from(inputElements).forEach(inputElement => {
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }
                inputElement.oninput = function () {
                    var message = getParent(inputElement, options.formGroup).querySelector(options.errorSelector)
                    message.innerText = ''
                    getParent(inputElement, options.formGroup).classList.remove('invalid')
                }
            })
    
        });

        form.onsubmit = function (e) {
            e.preventDefault();
            var isValid = true;

            options.rules.forEach(rule => {
                var inputElement = form.querySelector(rule.selector)
                var valid = validate(inputElement, rule)
                if (!valid) isValid = false;
            })

            if (isValid) {
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = form.querySelectorAll('[name]');
                    const formValues = Array.from(enableInputs).reduce(function(values, input) {
                        switch (input.type) {
                            case 'radio':
                                if (input.matches(':checked')) {
                                    values[input.name] = input.value
                                }
                                break;
                            case 'checkbox':
                                if (input.matches(':checked')) {
                                    if (!Array.isArray(values[input.name])) {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value)
                                }
            
                                break;
                            default:
                                values[input.name] = input.value
                        }

                        return values
                    }, {})
                    options.onSubmit(formValues);
                }
            }
            else {
                console.log('error')
            }
        }

    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return (typeof value === 'String' && value.trim()) || value ? undefined : message || 'Trường này cần phải nhập'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function(value) {
            const regix = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regix.test(value) ? undefined : message || 'Trường này phải là email'
        }
    }
}

Validator.lengthMin = function (selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim().length >= min ? undefined : message || `Trường này cần phải nhập tối thiếu ${min} ký tự`
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào chưa chính xác'
        }
    }
}