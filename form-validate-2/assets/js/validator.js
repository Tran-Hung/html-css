function Validator(formSelector) {

    function getParent(inputElement, selector) {

        while (inputElement.parentElement) {
            if (inputElement.parentElement.matches(selector)) {
                return inputElement.parentElement
            }
            inputElement = inputElement.parentElement
        }
    }

    var formRules = {};

    var validateRules = {
        required: function (value) {
            return (typeof value === 'String' && value.trim()) || value ? undefined : 'Trường này cần phải nhập'
        },
        email: function (value) {
            const regix = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regix.test(value) ? undefined : 'Trường này phải là email'
        },
        min: function (min) {
            return function(value) {
                return value.trim().length >= min ? undefined : `Trường này cần phải nhập tối thiếu ${min} ký tự`
            }
        },
        max: function (max) {
            return function(value) {
                return value.trim().length <= max ? undefined : `Trường này chỉ được nhập tối đa ${min} ký tự`
            }
        }
    }

    var formElement = document.querySelector(formSelector);
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]')
        for (var input of inputs) {
            var valids = input.getAttribute('rules').split('|');
            valids.forEach(valid => {
                var isValidHasValue = valid.includes(':')
                var ruleInfo;

                var ruleFunc = validateRules[valid];

                if (isValidHasValue) {
                    ruleInfo = valid.split(':');
                    valid = ruleInfo[0]
                    ruleFunc = validateRules[valid](ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                }else {
                    formRules[input.name] = [ruleFunc]
                }
            });
            input.onblur = handleValidate;
            input.oninput = clearErrorMessage;
        }

        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;
            for (var i = 0; i < rules.length; i++) {
                errorMessage = rules[i](event.target.value)
                if (errorMessage) break;
            }
            var message = getParent(event.target, '.form-group').querySelector('.form-message')
            if (errorMessage) {
                message.innerText = errorMessage
                getParent(event.target, '.form-group').classList.add('invalid')
            }
            return !errorMessage
        }

        function clearErrorMessage(event) {
            var formGroup = getParent(event.target, '.form-group');
            if (formGroup.classList.contains('invalid')) {
                var message = formGroup.querySelector('.form-message')
                message.innerText = ''
                formGroup.classList.remove('invalid')
            }
        }

        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isValid = true;
            var inputs = formElement.querySelectorAll('[name][rules]')
            for (let input of inputs) {
                var valid = handleValidate({target: input})
                if (!valid) isValid = false;
            }
            if (isValid) {
                var enableInputs = formElement.querySelectorAll('[name]');
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
                fetchApi(formValues);
            }
            else {
                console.log('error')
            }
        }
    }

    function fetchApi(form) {
        console.log(form)
    }
}