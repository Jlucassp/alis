// -------------------------------------------------- Dashboard da Conta do Usuário --------------------------------------------------

// Verificar se há uma seção armazenada no sessionStorage e exibi-la
const dashboardSection = sessionStorage.getItem('dashboardSection');
if (dashboardSection) {
    showContent(dashboardSection);
    sessionStorage.removeItem('dashboardSection'); // Remover após exibir para evitar comportamento inesperado ao navegar
} else {
    showContent('visaoGeral'); // Se nenhuma seção estiver armazenada, exibe a visão geral
}

function showContent(sectionId) {
    const contents = document.querySelectorAll('.dashboard-content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    const selectedContent = document.getElementById(sectionId);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }

    // Atualiza a seleção do menu
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    sidebarItems.forEach(item => {
        item.classList.remove('selected');
    });
    document.querySelector(`.sidebar ul li[onclick="showContent('${sectionId}')"]`).classList.add('selected');
}

function logout() {
    // Função de logout
    alert('Você foi deslogado com sucesso!');
}

const pedidos = []; // Inicialmente, a lista de pedidos está vazia

function renderPedidos() {
    const noOrdersMessage = document.getElementById('no-orders-message');
    const pedidosTable = document.getElementById('pedidos-table');
    const pedidosTbody = document.getElementById('pedidos-tbody');

    // Limpa o conteúdo da tabela para garantir que não há duplicação
    pedidosTbody.innerHTML = '';

    if (pedidos.length === 0) {
        // Se não houver pedidos, exibe a mensagem e oculta a tabela
        noOrdersMessage.style.display = 'block';
        pedidosTable.style.display = 'none';
    } else {
        // Caso haja pedidos, exibe a tabela e oculta a mensagem
        noOrdersMessage.style.display = 'none';
        pedidosTable.style.display = 'table';

        // Popula a tabela com os pedidos
        pedidos.forEach((pedido) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.data}</td>
                <td>${pedido.status}</td>
                <td>${pedido.total}</td>
            `;
            pedidosTbody.appendChild(row);
        });
    }
}

// Inicializa o conteúdo de "Meus Pedidos"
renderPedidos();

// Preencher os detalhes da conta com os dados armazenados
const userName = sessionStorage.getItem('userName');
const userEmail = sessionStorage.getItem('userEmail');

if (userName) {
    document.getElementById('account-name').textContent = userName;
}

if (userEmail) {
    document.getElementById('account-email').textContent = userEmail;
}

// Exemplo: Adicionando um pedido para testar a exibição da tabela (remova ou altere conforme necessário)
// adicionarPedido('#12345', '12/10/2024', 'Em Processamento', 'R$299,90');

function adicionarPedido(id, data, status, total) {
    pedidos.push({ id, data, status, total });
    renderPedidos(); // Atualiza a interface
}

document.addEventListener('DOMContentLoaded', function() {
    // ------------------------------------------------ Edição de Dados Pessoais -------------------------------------------------

    // Função para renderizar os detalhes da conta
    function renderAccountDetails() {
        const userName = sessionStorage.getItem('userName');
        const name = userName || "Não definido";
        const birthday = localStorage.getItem('account-birthday') || "Não definido";
        const gender = localStorage.getItem('account-gender') || "Não definido";

        document.getElementById('account-name').textContent = name;
        document.getElementById('account-birthday').textContent = birthday;
        document.getElementById('account-gender').textContent = gender;
    }

    // Ao clicar em "Editar Detalhes"
    document.getElementById('edit-account-details').addEventListener('click', function() {
        const name = localStorage.getItem('account-name') || '';
        const birthday = localStorage.getItem('account-birthday') || '';
        const gender = localStorage.getItem('account-gender') || '';

        const editHtml = `
            <h4>Editar Detalhes da Conta</h4>
            <form id="editDetailsForm">
                <label for="new-name">Nome:</label>
                <input type="text" id="new-name" value="${name}" required>

                <label for="new-birthday">Data de Nascimento:</label>
                <input type="date" id="new-birthday" value="${birthday}" required>

                <label for="new-gender">Gênero:</label>
                <select id="new-gender">
                    <option value="">Escolha um gênero</option>
                    <option value="masculino" ${gender === 'masculino' ? 'selected' : ''}>Masculino</option>
                    <option value="feminino" ${gender === 'feminino' ? 'selected' : ''}>Feminino</option>
                    <option value="outro" ${gender === 'outro' ? 'selected' : ''}>Outro</option>
                </select>

                <button type="submit" class="find-products-btn">Atualizar Informações</button>
                <button type="button" class="find-products-btn" id="cancelEdit">Cancelar</button>
            </form>
        `;

        document.getElementById('account-details').innerHTML = editHtml;

        document.getElementById('cancelEdit').addEventListener('click', function() {
            renderAccountDetails(); // Retorna aos detalhes
        });

        document.getElementById('editDetailsForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const newName = document.getElementById('new-name').value;
            const newBirthday = document.getElementById('new-birthday').value;
            const newGender = document.getElementById('new-gender').value;

            localStorage.setItem('account-name', newName);
            localStorage.setItem('account-birthday', newBirthday);
            localStorage.setItem('account-gender', newGender);

            renderAccountDetails(); // Atualiza a visualização
        });
    });

    renderAccountDetails(); // Renderiza os detalhes ao carregar a página
});

// -------------------------------------------------- Edição de Endereço --------------------------------------------------
// Elementos da seção de endereços
const enderecosView = document.getElementById('enderecos-view');
const enderecosEditForm = document.getElementById('enderecos-edit-form');
const adicionarEnderecoBtn = document.getElementById('adicionar-endereco-btn');
const cancelarEdicaoBtn = document.getElementById('cancelar-edicao-btn');
const enderecosHeader = document.getElementById('enderecos-header');
const adicionarEnderecoHeader = document.getElementById('adicionar-endereco-header');

let enderecos = JSON.parse(localStorage.getItem(`enderecos_${userEmail}`)) || [];
let editIndex = null; // Índice do endereço que está sendo editado

// Renderiza os endereços na tela
function renderEnderecos() {
    const enderecosContainer = document.getElementById('enderecos-container');
    enderecosContainer.innerHTML = ''; // Limpa o conteúdo anterior
    enderecosView.innerHTML = ''; // Limpa o conteúdo anterior

    // Exibe o botão "Adicionar Endereço" abaixo do título
    enderecosHeader.style.display = 'block';
    adicionarEnderecoHeader.style.display = 'none';

    if (enderecos.length === 0) {
        enderecosView.innerHTML += `<p>Nenhum endereço cadastrado!</p>`;

        // Coloca o botão "Adicionar Endereço" abaixo da mensagem
        const addButton = document.createElement('button');
        addButton.id = 'editar-endereco-btn';
        addButton.className = 'find-products-btn';
        addButton.textContent = 'Adicionar Endereço';
        addButton.onclick = showEditForm; // Correção na referência de evento

        enderecosView.appendChild(addButton);
        enderecosContainer.style.display = 'none';
    } else {
        // Exibe o botão "Adicionar Endereço" abaixo da lista de endereços
        const addButton = document.createElement('button');
        addButton.id = 'editar-endereco-btn';
        addButton.className = 'find-products-btn';
        addButton.textContent = 'Adicionar Endereço';
        addButton.onclick = showEditForm; // Correção na referência de evento

        enderecosView.appendChild(addButton);

        enderecos.forEach((endereco, index) => {
            const enderecoDiv = document.createElement('div');
            enderecoDiv.className = 'endereco-item';
            if (endereco.isDefault) {
                enderecoDiv.style.border = '1px solid #424240';
            }
            enderecoDiv.innerHTML += `
                <h4>${endereco.nome} ${endereco.sobrenome}</h4>
                <p>${endereco.endereco}, ${endereco.numero}</p>
                <p>${endereco.complemento}</p>
                <p>${endereco.bairro}</p>
                <p>${endereco.cidade}, ${endereco.estado}, ${endereco.cep}, ${endereco.pais}</p>
                <p>${endereco.telefone}</p>
                <div class="endereco-buttons">
                    <button class="editar-info-endereco-btn" data-index="${index}">Editar</button>
                    <button class="excluir-endereco-btn" data-index="${index}">Excluir</button>
                </div>
                <div class="default-buttons">
                    ${endereco.isDefault ? `<span class="padrao">Padrão</span>` : `<button class="set-default-btn" data-index="${index}">Definir como padrão</button>`}
                </div>
            `;
            enderecosContainer.appendChild(enderecoDiv);
        });

        enderecosContainer.style.display = 'flex'; // Exibe o container com os endereços

        // Adiciona os eventos aos botões de editar e excluir
        addEditAndDeleteEvents();
        addSetDefaultEvent();
    }
}

// Função para definir o endereço como padrão
function addSetDefaultEvent() {
    const setDefaultButtons = document.querySelectorAll('.set-default-btn');
    setDefaultButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = button.dataset.index;

            // Remove a marcação de padrão de todos os endereços
            enderecos.forEach((endereco) => {
                endereco.isDefault = false; // Reseta todos para não padrão
            });

            enderecos[index].isDefault = true; // Define o endereço clicado como padrão

            // Salva no localStorage e re-renderiza os endereços
            localStorage.setItem(`enderecos_${userEmail}`, JSON.stringify(enderecos));
            renderEnderecos();
        });
    });
}

function addEditAndDeleteEvents() {
    const editarButtons = document.querySelectorAll('.editar-info-endereco-btn');
    const excluirButtons = document.querySelectorAll('.excluir-endereco-btn');

    editarButtons.forEach(button => {
        button.addEventListener('click', function () {
            editIndex = button.dataset.index; // Salva o índice do endereço que será editado
            const endereco = enderecos[editIndex];

            // Preencher o formulário de edição
            document.getElementById('nome_endereco').value = endereco.nome;
            document.getElementById('sobrenome_endereco').value = endereco.sobrenome;
            document.getElementById('cpf_endereco').value = endereco.cpf;
            document.getElementById('telefone_endereco').value = endereco.telefone;
            document.getElementById('pais_endereco').value = endereco.pais;
            document.getElementById('cep_endereco').value = endereco.cep;
            document.getElementById('endereco_endereco').value = endereco.endereco;
            document.getElementById('numero_endereco').value = endereco.numero;
            document.getElementById('complemento_endereco').value = endereco.complemento;
            document.getElementById('bairro_endereco').value = endereco.bairro;
            document.getElementById('cidade_endereco').value = endereco.cidade;
            document.getElementById('estado_endereco').value = endereco.estado;

            ajustarLabels();

            enderecosView.style.display = 'none';
            enderecosEditForm.style.display = 'block';
            enderecosHeader.style.display = 'none';
            adicionarEnderecoHeader.style.display = 'block';

            const enderecosContainer = document.getElementById('enderecos-container');
            enderecosContainer.style.display = 'none';

            // Muda o texto do botão para "Atualizar Endereço"
            adicionarEnderecoBtn.textContent = 'Atualizar Endereço';
        });
    });

    excluirButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = button.dataset.index;
            if (confirm("Tem certeza que deseja excluir este endereço?")) {
                enderecos.splice(index, 1); // Remove o endereço da lista
                localStorage.setItem(`enderecos_${userEmail}`, JSON.stringify(enderecos));
                renderEnderecos();
            }
        });
    });
}

// Mostrar o formulário para adicionar um novo endereço
function showEditForm() {
    enderecosView.style.display = 'none';
    enderecosEditForm.style.display = 'block';
    enderecosHeader.style.display = 'none';
    adicionarEnderecoHeader.style.display = 'block';

    // Limpa os campos para novos endereços
    document.querySelectorAll('#add-endereco-form input').forEach(input => {
        input.value = '';
        removerMensagemErro(input);
        input.classList.remove('input-error');
        resetLabel(input); // Resetando o label ao adicionar novo endereço
    });

    document.getElementById('estado_endereco').value = "";

    // Muda o texto do botão para "Adicionar Endereço"
    adicionarEnderecoBtn.textContent = 'Adicionar Endereço';
    editIndex = null; // Reseta o índice

    // Limpa o contêiner de endereços
    const enderecosContainer = document.getElementById('enderecos-container');
    enderecosContainer.style.display = 'none'; // Limpa o conteúdo anterior
}

// Função para resetar o label
function resetLabel(input) {
    definirLabel(input.nextElementSibling, false); // Reseta o label ao adicionar novo endereço
}

// Função para definir as propriedades do label
function definirLabel(label, isActive) {
    if (isActive) {
        label.style.top = '10px';
        label.style.fontSize = '12px';
        label.style.color = '#666';
    } else {
        label.style.top = '18px';
        label.style.fontSize = '16px';
        label.style.color = '#888';
    }
}

// Função para ajustar os labels
function ajustarLabels() {
    document.querySelectorAll('#add-endereco-form input').forEach(input => {
        const label = input.parentNode.querySelector('label[for="' + input.id + '"]');
        const valor = input.value.trim();
        definirLabel(label, valor.length > 0);
    });
}

// Ocultar o formulário de edição ao clicar em "Cancelar"
cancelarEdicaoBtn.addEventListener('click', function () {
    enderecosEditForm.style.display = 'none';
    enderecosView.style.display = 'block';

    enderecosHeader.style.display = 'block';
    adicionarEnderecoHeader.style.display = 'none';

    // Limpa os campos e mensagens de erro
    document.querySelectorAll('#add-endereco-form input').forEach(input => {
        input.value = '';
        removerMensagemErro(input);
        input.classList.remove('input-error');
        resetLabel(input);
    });

    renderEnderecos();
});

// Função de validação para os campos do formulário de endereço
function validarCamposEndereco() {
    let isValid = true;
    const camposObrigatorios = [
        { id: 'nome_endereco', validar: validarNome, mensagemErro: 'Nome deve conter apenas letras e espaços.' },
        { id: 'sobrenome_endereco', validar: validarSobrenome, mensagemErro: 'Sobrenome deve conter apenas letras e espaços.' },
        { id: 'cpf_endereco', validar: validarCPF, mensagemErro: 'O CPF deve estar no formato correto.' },
        { id: 'telefone_endereco', validar: validarTelefone, mensagemErro: 'Telefone deve estar no formato correto.' },
        { id: 'pais_endereco' },
        { id: 'cep_endereco', validar: validarCEP, mensagemErro: 'O CEP fornecido está incompleto.' },
        { id: 'endereco_endereco' },
        { id: 'numero_endereco', validar: validarNumero },
        { id: 'bairro_endereco' },
        { id: 'cidade_endereco' },
        { id: 'estado_endereco', validar: validarEstado },
    ];

    // Variável para armazenar o primeiro campo com erro
    let firstErrorField = null;

    camposObrigatorios.forEach((campo) => {
        const input = document.getElementById(campo.id);
        const valor = input.value.trim();

        // Resetar a classe de erro
        input.classList.remove('input-error');

        // Verificação 1: Se o campo está vazio
        if (!valor) {
            isValid = false;
            input.classList.add('input-error');
            exibirMensagemErro(input, 'Campo obrigatório.');
            
            // Se for o primeiro erro, armazena o campo
            if (!firstErrorField) {
                firstErrorField = input;
            }
        } // Verificação 2: Se o campo não está vazio, validar o valor, se a validação existir
        else if (campo.validar && !campo.validar(valor)) {
            isValid = false;
            input.classList.add('input-error');
            exibirMensagemErro(input, campo.mensagemErro);

            // Se for o primeiro erro, armazena o campo
            if (!firstErrorField) {
                firstErrorField = input;
            }
        } 
        // Se o campo está correto, remover mensagem de erro
        else {
            removerMensagemErro(input);
        }
    });

    // Validação específica para o telefone
    const telefoneInput = document.getElementById('telefone_endereco');
    const telefoneValor = telefoneInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (!telefoneValor) {
        isValid = false;
        input.classList.add('input-error');
        exibirMensagemErro(input, 'Campo obrigatório.');
        
        // Se for o primeiro erro, armazena o campo
        if (!firstErrorField) {
            firstErrorField = input;
        }
    // Chama a validação existente ao dar 'blur' no telefone
    } else if (telefoneValor.charAt(0) === '0' || telefoneValor.length >= 2 && !validarDDD(telefoneValor.slice(0, 2))) {
        isValid = false;
        exibirMensagemErro(telefoneInput, 'O DDD é inválido.');
        telefoneInput.classList.add('input-error');

        // Se for o primeiro erro, armazena o campo
        if (!firstErrorField) {
            firstErrorField = telefoneInput;
        }
    } else if (telefoneValor.length >= 3 && telefoneValor.charAt(2) !== '9') {
        isValid = false;
        exibirMensagemErro(telefoneInput, 'O prefixo deve ser 9.');
        telefoneInput.classList.add('input-error');

        // Se for o primeiro erro, armazena o campo
        if (!firstErrorField) {
            firstErrorField = telefoneInput;
        }
    } else if (telefoneValor.length < 11) {
        isValid = false;
        exibirMensagemErro(telefoneInput, 'O número de telefone está incompleto.');
        telefoneInput.classList.add('input-error');

        // Se for o primeiro erro, armazena o campo
        if (!firstErrorField) {
            firstErrorField = telefoneInput;
        }
    } else {
        removerMensagemErro(telefoneInput);
    }

    // Se houver um campo com erro, dê foco a ele
    if (firstErrorField) {
        firstErrorField.focus();
    }

    return isValid;
}

// Função para remover mensagens de erro
function removerMensagemErro(input) {
    const mensagemErro = input.nextElementSibling;
    if (mensagemErro && mensagemErro.classList.contains('mensagem-erro')) {
        mensagemErro.remove();
    }
}

// Validação de Nome
function validarNome(nome) {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(nome); // Aceita apenas letras e espaços
}

// Validação de Sobrenome
function validarSobrenome(sobrenome) {
    return /^[A-Za-zÀ-ÿ\s]+$/.test(sobrenome); // Aceita apenas letras e espaços
}

// Validação de CPF
function validarCPF(cpf) {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf) || /^\d{11}$/.test(cpf);
}

// Validação de Telefone
function validarTelefone(telefone) {
    return /^\(\d{2}\) \d{4,5}-\d{4}$/.test(telefone) || /^\d{10,11}$/.test(telefone);
}

// Validação de CEP
function validarCEP(cep) {
    return /^\d{5}-\d{3}$/.test(cep);
}

function validarNumero(numero) {
    return /^\d+$/.test(numero);
}

function validarEstado(estado) {
    return estado !== "";
}

// Formatação automática do CPF
document.getElementById('cpf_endereco').addEventListener('input', function (e) {
    let cpf = e.target.value.replace(/\D/g, '');
    if (cpf.length > 11) {
        cpf = cpf.slice(0, 11);
    }
    if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    }
    if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    }
    if (cpf.length > 10) {
        cpf = cpf.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    }
    e.target.value = cpf;
});

// Validação de CPF ao perder o foco
document.getElementById('cpf_endereco').addEventListener('blur', function() {
    const input = this;
    const valor = input.value.trim();

    if (!valor) {
        exibirMensagemErro(input, 'Campo obrigatório.');
        input.classList.add('input-error');
    } else if (!validarCPF(valor)) {
        exibirMensagemErro(input, 'O CPF deve estar no formato correto.');
        input.classList.add('input-error');
    } else {
        removerMensagemErro(input);
    }
});

// Formatação automática do telefone
document.getElementById('telefone_endereco').addEventListener('input', function (e) {
    let telefone = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos

    // Limitar o número máximo de dígitos
    if (telefone.length > 11) {
        telefone = telefone.substring(0, 11);
    }

    // Aplicar formatação do telefone
    telefone = telefone.replace(/^(\d{2})(\d)/, '($1) $2'); // Adiciona os parênteses ao DDD
    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen

    e.target.value = telefone; // Atualiza o campo de entrada

    // Validação em tempo real
    const valor = telefone.replace(/\D/g, '');
    if (valor.length >= 2) {
        const ddd = valor.slice(0, 2);
        const prefixo = valor.charAt(2); // Terceiro dígito

        if (valor.charAt(0) === '0' || !validarDDD(ddd)) {
            exibirMensagemErro(e.target, 'O DDD é inválido.');
            e.target.classList.add('input-error');
        } else if (prefixo !== '9' && valor.length >= 3) {
            exibirMensagemErro(e.target, 'O prefixo deve ser 9.');
            e.target.classList.add('input-error');
        } else {
            removerMensagemErro(e.target);
            e.target.classList.remove('input-error');
        }
    } else {
        removerMensagemErro(e.target);
        e.target.classList.remove('input-error');
    }
});

// Validação de telefone ao perder o foco
document.getElementById('telefone_endereco').addEventListener('blur', function() {
    const input = this;
    const valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (!valor) {
        exibirMensagemErro(input, 'Campo obrigatório.');
        input.classList.add('input-error');
    } else if (valor.charAt(0) === '0' || valor.length >= 2 && !validarDDD(valor.slice(0, 2))) {
        exibirMensagemErro(input, 'O DDD é inválido.');
        input.classList.add('input-error');
    } else if (valor.length >= 3 && valor.charAt(2) !== '9') {
        exibirMensagemErro(input, 'O prefixo deve ser 9.');
        input.classList.add('input-error');
    } else if (valor.length < 11) {
        // Se o telefone estiver incompleto e a classe de erro não estiver ativada
        if (!input.classList.contains('input-error')) {
            exibirMensagemErro(input, 'O número de telefone está incompleto.');
        }
        input.classList.add('input-error');
    } else {
        removerMensagemErro(input);
    }
});

document.getElementById('pais_endereco').addEventListener('change', function() {
    const label = this.nextElementSibling;
    definirLabel(label, true);
});

// Formatação automática do CEP
document.getElementById('cep_endereco').addEventListener('input', function (e) {
    let cep = e.target.value.replace(/\D/g, '');

    // Limitar o número máximo de dígitos
    if (cep.length > 8) {
        cep = cep.substring(0, 8);
    }

    // Adiciona o hífen após os 5 primeiros dígitos
    if (cep.length > 5) {
        cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    }

    e.target.value = cep; // Atualiza o campo de entrada
});

// Validação de CEP ao perder o foco
document.getElementById('cep_endereco').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');

    if (!cep) {
        exibirMensagemErro(this, 'Campo obrigatório.');
        this.classList.add('input-error');
    } else if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) { // Verifica se o CEP é válido
                    document.getElementById('endereco_endereco').value = data.logradouro;
                    document.getElementById('bairro_endereco').value = data.bairro;
                    document.getElementById('cidade_endereco').value = data.localidade;
                    document.getElementById('estado_endereco').value = data.uf;

                    ajustarLabels();
                } else {
                    exibirMensagemErro(this, 'CEP não encontrado.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o CEP:', error);
                exibirMensagemErro(this, 'Ocorreu um erro ao buscar o CEP. Tente novamente.');
            });
    } else {
        exibirMensagemErro(this, 'CEP inválido. Certifique-se de que tem 8 dígitos.');
    }
});

// Filtrar entrada para permitir apenas números
document.getElementById('numero_endereco').addEventListener('input', function (e) {
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('estado_endereco').addEventListener('change', function() {
    const label = this.nextElementSibling;
    definirLabel(label, true);
});

// Adicione o evento blur ao select do estado
document.getElementById('estado_endereco').addEventListener('blur', function() {
    const input = this;
    const label = input.parentNode.querySelector('label[for="' + input.id + '"]');
    const valor = input.value;

    if (!valor) {
        exibirMensagemErro(input, 'Campo obrigatório.');
        input.classList.add('input-error');
        definirLabel(label, true);
    } else {
        definirLabel(label, true);
    }
});

// Função para validar DDD
function validarDDD(ddd) {
    return /^(11|12|13|14|15|16|17|18|19|21|22|24|27|28|31|32|33|34|35|37|38|41|42|43|44|45|46|47|48|49|51|53|54|55|61|62|63|64|65|66|67|68|69|71|73|74|75|77|79|81|82|83|84|85|86|87|88|89|91|92|93|94|95|96|97|98|99)$/.test(ddd);
}

// Função para validar o telefone completo
function validarTelefoneCompleto(telefone) {
    const ddd = telefone.slice(0, 2);
    const prefixo = telefone.charAt(2); // Terceiro dígito

    const dddValido = validarDDD(ddd);
    
    // Verifica se o prefixo é 9
    const prefixoValido = prefixo === '9';

    return dddValido && prefixoValido; // Retorna true se ambos forem válidos
}

// Função para exibir mensagens de erro
function exibirMensagemErro(input, mensagem) {
    let mensagemErro = input.nextElementSibling;
    if (!mensagemErro || !mensagemErro.classList.contains('mensagem-erro')) {
        mensagemErro = document.createElement('span');
        mensagemErro.classList.add('mensagem-erro');
        input.parentNode.insertBefore(mensagemErro, input.nextSibling);
    }
    mensagemErro.textContent = mensagem;
}

// Atualiza a mensagem de erro em tempo real
function atualizarErro(input) {
    const valor = input.value.trim();
    const campoId = input.id;

    // Se o campo está vazio, exibe "Campo obrigatório"
    if (!valor) {
        exibirMensagemErro(input, 'Campo obrigatório.');
        input.classList.add('input-error');
    } 
    // Se o campo não está vazio, verifica as validações específicas (nome, sobrenome, etc.)
    else if ((campoId === 'nome_endereco' && !validarNome(valor)) ||
             (campoId === 'sobrenome_endereco' && !validarSobrenome(valor))) {
        input.classList.add('input-error');
        let mensagemErro = obterMensagemErro(campoId);
        exibirMensagemErro(input, mensagemErro);
    } else if (campoId === 'telefone_endereco') {
        // Validação do telefone
        const telefoneNumeros = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (telefoneNumeros.charAt(0) === '0' || telefoneNumeros.length >= 2 && !validarDDD(telefoneNumeros.slice(0, 2))) {
            input.classList.add('input-error');
            exibirMensagemErro(input, 'O DDD é inválido.');  
        } else if (telefoneNumeros.length >= 3 && telefoneNumeros.charAt(2) !== '9') {
            input.classList.add('input-error');
            exibirMensagemErro(input, 'O prefixo deve ser 9.');
        } else {
            removerMensagemErro(input);
            input.classList.remove('input-error');
        }
    }
    // Se tudo está correto, remove o erro
    else {
        removerMensagemErro(input);
        input.classList.remove('input-error');
    }
}

// Adicionar evento de input para validação em tempo real
document.querySelectorAll('#add-endereco-form input').forEach(input => {
    input.addEventListener('input', () => atualizarErro(input));

    input.addEventListener('focus', () => {
        const label = input.parentNode.querySelector('label[for="' + input.id + '"]');
        definirLabel(label, true);
    });

    input.addEventListener('blur', () => {
        const valor = input.value.trim();
        const label = input.parentNode.querySelector('label[for="' + input.id + '"]');
        definirLabel(label, valor.length > 0);
    });
});

// Atualiza as mensagens de erro de acordo com o campo
function obterMensagemErro(campoId) {
    const mensagens = {
        nome_endereco: 'Nome deve conter apenas letras e espaços.',
        sobrenome_endereco: 'Sobrenome deve conter apenas letras e espaços.',
        cpf_endereco: 'CPF deve estar no formato correto.',
        telefone_endereco: 'Telefone deve estar no formato correto.',
        cep_endereco: 'CEP deve estar no formato correto.'
    };

    return mensagens[campoId] || 'Campo obrigatório.';
}

// Adicionar lógica para o botão "Adicionar Endereço"
adicionarEnderecoBtn.addEventListener('click', function () {
    const isValid = validarCamposEndereco(); // Armazena o resultado da validação

    // Se a validação não passar, não permita o envio do formulário
    if (!isValid) {
        return; // Para o envio se houver erros
    }

    // Se todos os campos forem válidos, pega os valores dos inputs e prossegue
    const nome = document.getElementById('nome_endereco').value;
    const sobrenome = document.getElementById('sobrenome_endereco').value;
    const cpf = document.getElementById('cpf_endereco').value;
    const telefone = document.getElementById('telefone_endereco').value;
    const pais = document.getElementById('pais_endereco').value;
    const cep = document.getElementById('cep_endereco').value;
    const endereco = document.getElementById('endereco_endereco').value;
    const numero = document.getElementById('numero_endereco').value;
    const complemento = document.getElementById('complemento_endereco').value;
    const bairro = document.getElementById('bairro_endereco').value;
    const cidade = document.getElementById('cidade_endereco').value;
    const estado = document.getElementById('estado_endereco').value;

    // Se estamos editando um endereço, atualiza-o, caso contrário, adiciona um novo
    if (editIndex !== null) {
        const enderecoAtual = enderecos[editIndex];
        const isDefault = enderecoAtual.isDefault; // Armazena se era padrão

        // Atualiza o endereço
        enderecos[editIndex] = { nome, sobrenome, cpf, telefone, pais, cep, endereco, numero, complemento, bairro, cidade, estado, isDefault };
    } else {
        // Adiciona um novo endereço
        const novoEndereco = { nome, sobrenome, cpf, telefone, pais, cep, endereco, numero, complemento, bairro, cidade, estado, isDefault: false };

        // Verifica se já existe algum endereço padrão
        const enderecoPadrao = enderecos.find(endereco => endereco.isDefault);
        if (!enderecoPadrao) {
            novoEndereco.isDefault = true; // Define como padrão se não existir nenhum
        }

        enderecos.push(novoEndereco);
    }

    const novoEndereco = { nome, sobrenome, cpf, telefone, pais, cep, endereco, numero, complemento, bairro, cidade, estado, isDefault: false };

    // Remove qualquer outro padrão, se o novo endereço for padrão
    if (novoEndereco.isDefault) {
        enderecos.forEach(e => {
            if (e !== novoEndereco) {
                e.isDefault = false; // Remove o padrão do endereço anterior
            }
        });
    }

    // Salva os endereços no localStorage
    localStorage.setItem(`enderecos_${userEmail}`, JSON.stringify(enderecos));

    // Mostra o título "Endereços" e o botão "Adicionar Endereço"
    enderecosHeader.style.display = 'block';
    adicionarEnderecoHeader.style.display = 'none';
    
    // Depois de salvar, volte para a visualização dos endereços
    enderecosEditForm.style.display = 'none';
    enderecosView.style.display = 'block';

    // Atualizar a visualização dos endereços
    renderEnderecos();

    // Resetar o índice de edição
    editIndex = null;
});

// Renderiza os endereços ao carregar a página
renderEnderecos();