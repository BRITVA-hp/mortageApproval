document.addEventListener('DOMContentLoaded', () => {

        //select
        function select(selectActive, optionNumber) {
            const selects = document.querySelectorAll('[data-select]');
            selects.forEach((select, index) => {
                const options = select.querySelectorAll('[data-option]');
                select.addEventListener('click', () => {
                    selects.forEach((select1, index1) => {
                        if (index != index1) {
                            select1.classList.remove(selectActive);
                            select1.lastElementChild.style.maxHeight = '0';
                        }
                    });
                    if (select.classList.contains(selectActive)) {
                        select.classList.remove(selectActive);
                        select.lastElementChild.style.maxHeight = '0';
                    } else {
                        select.classList.add(selectActive);
                        if (optionNumber) {
                            select.lastElementChild.style.maxHeight = `${100 * optionNumber}%`;
                        } else {
                            select.lastElementChild.style.maxHeight = `${100 * options.length}%`;
                        }
                    }
                });
                options.forEach(option => {
                    option.addEventListener('click', () => {
                        select.firstElementChild.textContent = option.textContent;
                    });
                });
            });
            document.addEventListener('click', (e) => {
                if (!e.target.hasAttribute('data-select') && e.target.parentElement && !e.target.parentElement.hasAttribute('data-select')) {
                    selects.forEach(select => {
                        select.classList.remove(selectActive);
                        select.lastElementChild.style.maxHeight = '0';
                    });
                }
            });
        }
    
        select('calc__select--active', 5);

    // калькулятор ипотеки

    // вычисление платежа
    function getPayment(sum, period, rate) {
        // *
        // * sum - сумма кредита
        // * period - срок в годах
        // * rate - годовая ставка в процентах
        // * 
        let i,
            koef,
            payment;

        // ставка в месяц
        i = (rate / 12) / 100;

        // коэффициент аннуитета
        koef = (i * (Math.pow(1 + i, period * 12))) / (Math.pow(1 + i, period * 12) - 1);

        // итог
        payment = (sum * koef).toFixed();
        return payment;
    };

    // маска
    function prettify(num) {
        var n = num.toString();
        return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');
    }

    // считаем кредит
    function sumResult(credit, inputPrice, inputContribution, invalid) {
        let result;
        result = +inputPrice.value.replace(/\D/g, '') - +inputContribution.value.replace(/\D/g, '');
        credit.textContent = prettify(result) + ' руб.';
        if (result < 0) {
            credit.textContent = '';
            invalid.textContent = 'Первоначальный взнос должен быть меньше стоимости!';
        } else {
            invalid.textContent = '';
        }
    }

    // собираем всё вместе и выводим результаты при вводе значений
    function calc(maxPrice) {
        const inputPrice = document.querySelector('#sum'),
              inputContribution = document.querySelector('#fee'),
              term = document.querySelector('.calc__answer span'),
              termsOptions = document.querySelectorAll('.calc__option'),
              credit = document.querySelector('#credit'),
              payment = document.querySelector('#payment'),
              invalid = document.querySelector('.calc__result__item__text--invalid');

        inputPrice.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            this.value = prettify(this.value);
            if (this.value.replace(/\D/g, '') > maxPrice) {
                this.value = prettify(maxPrice);
            }

            sumResult(credit, inputPrice, inputContribution, invalid);

            console.log(+credit.textContent.replace(/\D/g, ''), +term.textContent.replace(/\D/g, ''));

            payment.textContent = prettify(getPayment(+credit.textContent.replace(/\D/g, ''), +term.textContent.replace(/\D/g, ''), 3)) + ' руб.';

        });

        inputContribution.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            this.value = prettify(this.value);
            if (this.value.replace(/\D/g, '') > maxPrice) {
                this.value = prettify(maxPrice);
            }

            sumResult(credit, inputPrice, inputContribution, invalid);

            payment.textContent = prettify(getPayment(+credit.textContent.replace(/\D/g, ''), +term.textContent.replace(/\D/g, ''), 3)) + ' руб.';

        });

        termsOptions.forEach(option => {
            option.addEventListener('click', () => {
                payment.textContent = prettify(getPayment(+credit.textContent.replace(/\D/g, ''), +term.textContent.replace(/\D/g, ''), 3)) + ' руб.';
            });
        });

    };

    calc(100000000);

});