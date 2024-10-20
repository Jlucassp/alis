document.addEventListener('DOMContentLoaded', function () {
    // -------------------------------------------------- Declaração de Variáveis Gerais --------------------------------------------------
    const products = document.querySelectorAll('.product-image img');
    const loginModal = document.querySelector('#login-modal');
    const registerModal = document.querySelector('#register-modal');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const resetPasswordModal = document.getElementById('reset-password-modal');
    const closeModalBtns = document.querySelectorAll(".close-btn");
    const userIconContainer = document.querySelector('.user-icon-container');
    const userMenu = document.querySelector('#user-menu');
    const hoverZone = document.querySelector('.hover-zone');
    const pageOverlay = document.querySelector('#page-overlay');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const resetPasswordInput = document.getElementById('new-password-recover');
    const confirmResetPasswordInput = document.getElementById('confirm-password-recover');
    const validationBox = document.getElementById('password-validation-box');
    const resetValidationBox = document.getElementById('password-validation-box-reset');
    const loginErrorMessage = document.getElementById('login-error-message');
    const registerErrorMessage = document.getElementById('register-error-message');
    const forgotErrorMessage = document.getElementById('forgot-error-message');
    const resetPasswordErrorMessage = document.getElementById('reset-password-error-message');
    let isSubmitting = false; // Flag to prevent multiple form submissions
    let isModalOpen = false; // Flag to track the state of the modal

    // -------------------------------------------------- Funções Utilitárias Gerais --------------------------------------------------

    // Função para alternar a visibilidade dos modais
    function toggleModal(modal, action) {
        if (action === 'show' && !isModalOpen) {
            modal.style.display = 'block';
            modal.style.visibility = 'visible';
            pageOverlay.classList.add('active');
            isModalOpen = true;
        } else if (action === 'hide') {
            modal.style.display = 'none';
            modal.style.visibility = 'hidden';
            pageOverlay.classList.remove('active');
            isModalOpen = false;
        }
    }

    // Função para checar se o usuário está logado
    function isUserLoggedIn() {
        return sessionStorage.getItem('userToken') !== null;
    }

    // Função para esconder o menu do usuário
    function hideUserMenu() {
        userMenu.style.display = 'none';
        userMenu.style.visibility = 'hidden';
        userMenu.style.opacity = '0';
    }

    // Função para mostrar o menu do usuário
    function showUserMenu() {
        if (isUserLoggedIn()) {
            userMenu.style.display = 'block';
            userMenu.style.visibility = 'visible';
            userMenu.style.opacity = '1';
        }
    }

    // Função para alternar visibilidade do menu de usuário ao entrar e sair do ícone
    function handleMouseEnter() {
        if (isUserLoggedIn()) {
            showUserMenu();
        }
    }

    // Função para ocultar o menu quando o mouse sair do ícone, hover-zone e do menu, se não estiver logado
    function handleMouseLeave() {
        if (!userIconContainer.matches(':hover') && !hoverZone.matches(':hover') && !userMenu.matches(':hover')) {
            hideUserMenu();
        }
    }

    // -------------------------------------------------- Manipulação de Modais e Menu do Usuário --------------------------------------------------

    // Inicializa escondendo o menu do usuário se ele não estiver logado
    if (!isUserLoggedIn()) {
        hideUserMenu();
    }

    // Listeners para exibir/ocultar o menu do usuário ao passar o mouse
    userIconContainer.addEventListener('mouseenter', handleMouseEnter);
    hoverZone.addEventListener('mouseenter', handleMouseEnter);
    userMenu.addEventListener('mouseenter', handleMouseEnter);
    userIconContainer.addEventListener('mouseleave', handleMouseLeave);
    hoverZone.addEventListener('mouseleave', handleMouseLeave);
    userMenu.addEventListener('mouseleave', handleMouseLeave);

    // Abrir modal de login ao clicar no ícone se não estiver logado
    userIconContainer.addEventListener('click', function (event) {
        event.preventDefault();
        if (!isUserLoggedIn()) {
            openLoginModal();
        }
    });

    // Função para abrir o modal de login
    function openLoginModal() {
        toggleModal(loginModal, 'show');
        document.getElementById('login-email').focus();
        clearMessage(loginErrorMessage); // Limpar mensagens de erro anteriores
    }

    // Função para fechar todos os modais
    function closeAllModals() {
        [loginModal, registerModal, forgotPasswordModal, resetPasswordModal].forEach(modal => {
            toggleModal(modal, 'hide');
        });
        document.activeElement.blur();
    }

    // Adicionar funcionalidade ao menu do usuário (links de navegação)
    userMenu.addEventListener('click', function (event) {
        event.preventDefault();
        const targetId = event.target.id;

        switch (targetId) {
            case 'menu-minha-conta':
                sessionStorage.setItem('dashboardSection', 'visaoGeral');
                window.location.href = '/user-profile.html';
                break;
            case 'menu-meus-pedidos':
                sessionStorage.setItem('dashboardSection', 'meusPedidos');
                window.location.href = '/user-profile.html';
                break;
            case 'menu-lista-desejos':
                sessionStorage.setItem('dashboardSection', 'listaDesejos');
                window.location.href = '/user-profile.html';
                break;
            case 'menu-sair':
                sessionStorage.removeItem('userToken');
                sessionStorage.removeItem('openLoginModal');
                closeAllModals();
                document.activeElement.blur();
                window.location.href = '/';
                break;
        }
    });

    // Fechar modais ao clicar no botão de fechar ou pressionar a tecla ESC
    closeModalBtns.forEach(btn => btn.addEventListener("click", closeAllModals));
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });

    pageOverlay.addEventListener('click', closeAllModals);

    // -------------------------------------------------- Alternar Entre Modais ----------------------------------------------------

    // Alternar entre login e registro
    document.getElementById('register-link').addEventListener('click', function(event) {
        event.preventDefault();
        toggleModal(loginModal, 'hide');
        toggleModal(registerModal, 'show');
        document.getElementById('register-name').focus();
    });

    // Alternar de registro para login
    document.getElementById('login-link').addEventListener('click', function(event) {
        event.preventDefault();
        toggleModal(registerModal, 'hide');
        toggleModal(loginModal, 'show');
        document.getElementById('login-email').focus();
    });

    // Abrir modal de "esqueci minha senha" a partir do modal de login
    document.getElementById('forgot-password-link').addEventListener('click', function (event) {
        event.preventDefault();
        toggleModal(loginModal, 'hide');
        toggleModal(forgotPasswordModal, 'show');
        document.getElementById('recovery-email').focus();
        clearMessage(forgotErrorMessage);
    });

    // Verificar se o token de reset está no sessionStorage e abrir o modal correspondente
    const resetToken = sessionStorage.getItem('resetPasswordToken');
    if (resetToken) {
        toggleModal(resetPasswordModal, 'show');
        sessionStorage.removeItem('resetPasswordToken');
    }

    // -------------------------------------------------- Validação de Formulário --------------------------------------------------

    // Função reutilizável para validação de e-mails
    function validateEmail(email) {
        return emailRegex.test(email);
    }

    // Função reutilizável para validação de senha
    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Pelo menos uma letra maiúscula, minúscula, número e caractere especial
        return passwordRegex.test(password);
    }

    // Função reutilizável para validar a confirmação de senha
    function validatePasswordMatch(password, confirmPassword) {
        return password === confirmPassword;
    }

    // Função para exibir mensagens de erro ou sucesso
    function displayMessage(element, message, isSuccess = false) {
        let iconHtml = '';
        if (!isSuccess) {
            iconHtml = `<span class="form-error-icon">✖</span>`;
        }
        const resetPasswordHtml = `<a href="#" class="reset-password-link"> Redefina sua senha.</a>`;

        if (message.includes('utilizado')) {
            const formattedMessage = message.replace('Redefina sua Senha.', '') + resetPasswordHtml;
            element.innerHTML = `${iconHtml} ${formattedMessage}`;
        } else {
            element.innerHTML = `${iconHtml} ${message}`;
        }
        
        element.style.display = 'block';
        element.style.color = isSuccess ? '#4cae4c' : '#d9534f';
        element.style.borderColor = isSuccess ? '#4cae4c' : '#d9534f';
        element.style.backgroundColor = isSuccess ? '#e6ffe6' : '#ffe6e6';
        document.querySelector('.modal-content').classList.add('form-error-active');

        // Add event listener to the "Redefina sua Senha" link
        const resetLink = document.querySelector('.reset-password-link');
        if (resetLink) {
            resetLink.addEventListener('click', function (event) {
                event.preventDefault();
                toggleModal(forgotPasswordModal, 'show');
                toggleModal(registerModal, 'hide');
                document.getElementById('recovery-email').focus();
            });
        }
    }

    // Função para limpar mensagens de erro ou sucesso
    function clearMessage(element) {
        if (element) {
            element.style.display = 'none';
            element.textContent = '';
            document.querySelector('.modal-content').classList.remove('form-error-active');
        }
    }

    // -------------------------------------------------- Validação de Senhas --------------------------------------------------

    // Critérios de validação de senha
    const criteria = {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /\d/,
        specialChar: /[\W_]/,
        minLength: /.{8,}/
    };

    // Elementos de validação da senha para registro e reset
    const validationElements = {
        uppercase: document.getElementById('uppercase-validation'),
        lowercase: document.getElementById('lowercase-validation'),
        number: document.getElementById('number-validation'),
        specialChar: document.getElementById('special-validation'),
        minLength: document.getElementById('length-validation')
    }

    const resetValidationElements = {
        uppercase: document.getElementById('uppercase-validation-reset'),
        lowercase: document.getElementById('lowercase-validation-reset'),
        number: document.getElementById('number-validation-reset'),
        specialChar: document.getElementById('special-validation-reset'),
        minLength: document.getElementById('length-validation-reset')
    };

    // Mostrar/Esconder caixa de validação da senha
    validationBox.style.display = 'none';
    resetValidationBox.style.display = 'none';

    passwordInput.addEventListener('focus', function () {
        validationBox.style.display = 'block';
    });

    passwordInput.addEventListener('blur', function () {
            validationBox.style.display = 'none';
    });

    resetPasswordInput.addEventListener('focus', function () {
        resetValidationBox.style.display = 'block';
    });

    resetPasswordInput.addEventListener('blur', function () {
        resetValidationBox.style.display = 'none';
    });

    // Validação da senha em tempo real (registro e reset)
    passwordInput.addEventListener('input', function () {
        validatePasswordInput(passwordInput, validationElements, registerErrorMessage);
    });

    resetPasswordInput.addEventListener('input', function () {
        validatePasswordInput(resetPasswordInput, resetValidationElements, resetPasswordErrorMessage);
    });

    function validatePasswordInput(inputElement, validationElements, errorMessageElement) {
        const password = inputElement.value;
        clearMessage(errorMessageElement);

        Object.keys(criteria).forEach(key => {
            const regex = criteria[key];
            const isValid = regex.test(password);
            validationElements[key].classList.toggle('valid', isValid);
            validationElements[key].classList.toggle('invalid', !isValid);
        });
    }

    // Validação de confirmação de senha (registro e reset)
    confirmPasswordInput.addEventListener('input', function () {
        validatePasswordMatchInput(passwordInput, confirmPasswordInput, registerErrorMessage);
    });

    confirmResetPasswordInput.addEventListener('input', function () {
        validatePasswordMatchInput(resetPasswordInput, confirmResetPasswordInput, resetPasswordErrorMessage);
    });

    function validatePasswordMatchInput(passwordInputElement, confirmPasswordInputElement, errorMessageElement) {
        const password = passwordInputElement.value;
        const confirmPassword = confirmPasswordInputElement.value;

        if (confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                displayMessage(errorMessageElement, 'As senhas não correspondem', false);
            } else {
                clearMessage(errorMessageElement);
            }
        }
    }

    // Esconder mensagem de erro se o campo de confirmar senha estiver vazio (Modal de Reset de Senha)
    confirmResetPasswordInput.addEventListener('blur', function () {
        if (confirmResetPasswordInput.value === '') {
            clearMessage(resetPasswordErrorMessage);
        }
    });

    // Esconder mensagem de erro se o campo de confirmar senha estiver vazio (Modal de Registro)
    confirmPasswordInput.addEventListener('blur', function () {
        if (confirmPasswordInput.value === '') {
            clearMessage(registerErrorMessage);
        }
    });

    // -------------------------------------------------- Validação de E-mail em Tempo Real --------------------------------------------------

    // Validação de email em tempo real para registro e login
    document.getElementById('register-email').addEventListener('input', function () {
        validateEmailInput(this, registerErrorMessage);
    });

    document.getElementById('login-email').addEventListener('input', function () {
        validateEmailInput(this, loginErrorMessage);
    });

    function validateEmailInput(emailElement, errorMessageElement) {
        const email = emailElement.value;

        if (!validateEmail(email)) {
            displayMessage(errorMessageElement, 'Por favor, insira um email válido.');
        } else {
            clearMessage(errorMessageElement);
        }

        if (email.length === 0) {
            clearMessage(errorMessageElement);
        }
    }

    // -------------------------------------------------- Fechar Modais e Outros Eventos --------------------------------------------------

    // Fechar modal de recuperação de senha e reset ao clicar no botão de fechar
    document.querySelector('#forgot-password-modal .close-btn').addEventListener('click', function() {
        forgotPasswordModal.style.display = 'none';
    });

    document.querySelector('#reset-password-modal .close-btn').addEventListener('click', function() {
        resetPasswordModal.style.display = 'none';
        pageOverlay.classList.remove('active');
    });

    // Fechar modal de reset/esqueci minha senha ao pressionar Enter
    document.getElementById('reset-password-modal').addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById('reset-password-btn').click();
        }
    });

    document.getElementById('forgot-password-modal').addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById('send-recovery-email-btn').click();
        }
    });

    // -------------------------------------------------- Exibir Modal de Login Quando Necessário --------------------------------------------------

    // Exibir modal de login se a flag estiver no sessionStorage
    if (sessionStorage.getItem('openLoginModal') === 'true') {
        openLoginModal();
        sessionStorage.removeItem('openLoginModal');
    }

    // -------------------------------------------------- Formulário de Registro, Login e Recuperação de Senha --------------------------------------------------

    // Função para enviar o formulário de registro do usuário
    window.registerUser = async function(event) {
        event.preventDefault();

        if (isSubmitting) return; // Prevenir múltiplos envios
        isSubmitting = true;

        const registerBtn = document.getElementById('register-btn');
        showSpinner(registerBtn); // Mostrar spinner enquanto aguarda resposta

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        clearMessage(registerErrorMessage); // Limpar qualquer mensagem anterior

        if (!validateEmail(email)) {
            displayMessage(registerErrorMessage, 'Por favor, insira um email válido.');
            hideSpinner(registerBtn);
            isSubmitting = false;
            return;
        }

        if (!validatePassword(password)) {
            displayMessage(registerErrorMessage, 'A sua senha deve atender a todos os requisitos mínimos.');
            hideSpinner(registerBtn);
            isSubmitting = false;
            return;
        }

        if (!validatePasswordMatch(password, confirmPassword)) {
            displayMessage(registerErrorMessage , 'As senhas não correspondem.');
            hideSpinner(registerBtn);
            isSubmitting = false;
            return;
        }

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setTimeout(() => {
                    hideSpinner(registerBtn);
                    toggleModal(registerModal, 'hide');
                    toggleModal(loginModal, 'show');
                }, 2000);
            } else {
                displayMessage(registerErrorMessage, data.message);
                hideSpinner(registerBtn);
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            displayMessage(registerErrorMessage, 'Erro no servidor, tente novamente mais tarde.');
            hideSpinner(registerBtn);
        } finally {
            isSubmitting = false;
        }
    };

    // Função para enviar o formulário de login do usuário
    window.loginUser = async function(event) {
        event.preventDefault();

        if (isSubmitting) return;
        isSubmitting = true;

        const loginBtn = document.getElementById('login-btn');
        showSpinner(loginBtn);

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        clearMessage(loginErrorMessage);

        if (!validateEmail(email)) {
            displayMessage(loginErrorMessage, 'Por favor, insira um email válido.');
            hideSpinner(loginBtn);
            isSubmitting = false;
            return;
        }

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // Armazene os detalhes do usuário após o login bem-sucedido
                sessionStorage.setItem('userToken', data.token);
                sessionStorage.setItem('userName', data.name);
                sessionStorage.setItem('userEmail', data.email);

                setTimeout(() => {
                    hideSpinner(loginBtn);
                    closeAllModals();
                    window.location.reload(); // Recarregar a página para atualizar a interface do usuário
                }, 2000);
            } else {
                displayMessage(loginErrorMessage, data.message);
                hideSpinner(loginBtn);
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            displayMessage(loginErrorMessage, 'Erro no servidor, tente novamente mais tarde.');
            hideSpinner(loginBtn);
        } finally {
            isSubmitting = false;
        }
    };

    // Função para enviar o formulário de email de recuperação do usuário
    document.getElementById('send-recovery-email-btn').addEventListener('click', async function (event) {
        event.preventDefault();
        
        const email = document.getElementById('recovery-email').value;
    
        forgotErrorMessage.textContent = '';
    
        // Basic email validation
        if (!validateEmail(email)) {
            displayMessage(forgotErrorMessage, 'Por favor, insira um e-mail válido', false);
            return;
        }
    
        try {
            const response = await fetch('/api/users/recover-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
    
            const data = await response.json();
            if (response.ok) {
                displayMessage(forgotErrorMessage, 'Um e-mail de recuperação foi enviado.', true);
                document.getElementById('recovery-email').value = '';
            } else {
                displayMessage(forgotErrorMessage, data.message || 'Erro ao enviar o e-mail.', false);
            }
        } catch (error) {
            console.error('Erro ao enviar o e-mail de recuperação:', error);
            displayMessage(forgotErrorMessage, 'Erro no servidor, tente novamente mais tarde.', false);
        }
    });

    // Função para enviar o formulário de redefinição de senha do usuário
    document.getElementById('reset-password-btn').addEventListener('click', async () => {
        const password = resetPasswordInput.value;
        const confirmPassword = confirmResetPasswordInput.value;

        if (password !== confirmPassword) {
            displayMessage(resetPasswordErrorMessage, 'As senhas não correspondem', false);
            return;
        }

        if (!validatePassword(password)) {
            displayMessage(resetPasswordErrorMessage, 'A sua senha deve atender a todos os requisitos mínimos.', false);
            return;
        }

        try {
            const response = await fetch(`/reset-password/${resetToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(resetPasswordErrorMessage, data.message, true);
                sessionStorage.setItem('openLoginModal', 'true');

                // Redireciona após 4 segundos
                setTimeout(() => {
                    window.location.href = '/';
                }, 4000);
            } else {
                displayMessage(resetPasswordErrorMessage, data.message, false);
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage(resetPasswordErrorMessage, 'Erro no servidor. Por favor, tente novamente mais tarde.', false);
        }
    });

    // -------------------------------------------------- Conclusão --------------------------------------------------

    // Adicionar event listeners de envio de formulários
    document.getElementById('register-form').addEventListener('submit', registerUser);
    document.getElementById('login-form').addEventListener('submit', loginUser);

    // -------------------------------------------------- Outras Funcionalidades --------------------------------------------------

    // Alternar imagens de produtos ao passar o mouse
    products.forEach((img) => {
        const originalSrc = img.src;
        const hoverSrc = img.getAttribute('data-hover');

        if (hoverSrc) {
            img.addEventListener('mouseover', () => { img.src = hoverSrc; });
            img.addEventListener('mouseout', () => { img.src = originalSrc; });
        }
    });

    // Toggle entre olho aberto e fechado para campo de senha
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Alterna o ícone entre olho aberto e fechado
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Mostrar/Esconder spinner ao enviar formulários
    function showSpinner(button) {
        const spinner = button.querySelector('.spinner');
        if (spinner) {
            spinner.style.display = 'block';
        }
    }

    function hideSpinner(button) {
        const spinner = button.querySelector('.spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
});

// -------------------------------------------------------------- Filter Script ----------------------------------------------------------------------

    const activeFiltersContainer = document.getElementById('active-filters');
    const clearAllButton = document.getElementById('clear-all-filters');
    const filterOptions = document.querySelectorAll('#filter-options-container input[type="checkbox"]');

    filterOptions.forEach(option => {
        option.addEventListener('change', () => {
            applyFilters();
            updateActiveFilters();
        });
    });

    function applyFilters() {
        const selectedGender = Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(el => el.value);
        const selectedCategory = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
        const selectedSize = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(el => el.value);
        const selectedColor = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value);

        const products = document.querySelectorAll('.product');

        products.forEach(product => {
            const productGender = product.getAttribute('data-gender');
            const productCategory = product.getAttribute('data-category');
            const productSize = product.getAttribute('data-size').split(',');
            const productColor = product.getAttribute('data-color');

            let genderMatch = selectedGender.length === 0 || selectedGender.includes(productGender);
            let categoryMatch = selectedCategory.length === 0 || selectedCategory.includes(productCategory);
            let sizeMatch = selectedSize.length === 0 || selectedSize.some(size => productSize.includes(size));
            let colorMatch = selectedColor.length === 0 || selectedColor.includes(productColor);

            if (genderMatch && categoryMatch && sizeMatch && colorMatch) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });

        updateActiveFilters();
    }

    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        activeFiltersContainer.innerHTML = ''; // Clear the previous active filters
        let hasFilters = false;

        filterOptions.forEach(option => {
            if (option.checked) {
                hasFilters = true;

                // Create the active filter tag
                const filterTag = document.createElement('div');
                filterTag.classList.add('active-filter-tag');
                filterTag.setAttribute('data-filter', option.name);
                filterTag.setAttribute('data-value', option.value);
                filterTag.innerHTML = `${option.value} <span class="remove-filter">&times;</span>`;

                // Make the whole filter tag clickable
                filterTag.addEventListener('click', function() {
                    const filterName = this.getAttribute('data-filter');
                    const filterValue = this.getAttribute('data-value');
                    const filterCheckbox = document.querySelector(`input[name="${filterName}"][value="${filterValue}"]`);

                    if (filterCheckbox) {
                        filterCheckbox.checked = false; // Uncheck the checkbox for the filter
                        applyFilters(); // Re-apply filters
                    }
                });

                activeFiltersContainer.appendChild(filterTag);
            }
        });

        // Show or hide the clear-all button based on filters
        const clearAllButton = document.getElementById('clear-all-filters');
        clearAllButton.style.display = hasFilters ? 'block' : 'none';
    }

    clearAllButton.addEventListener('click', () => {
        filterOptions.forEach(option => option.checked = false);
        applyFilters();
    });

    function toggleFilterSection(header) {
        header.classList.toggle('active');
        let options = header.nextElementSibling;
        if (options.style.display === "block") {
            options.style.display = "none";
        } else {
            options.style.display = "block";
        }
    }   