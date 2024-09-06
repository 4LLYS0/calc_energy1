document.addEventListener("DOMContentLoaded", function () {
    fetchTiposConsumidores();

    document.getElementById('tipoConsumidorFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveTipoConsumidor();
    });
});

function fetchTiposConsumidores() {
    console.log('Fetching tipos de consumidores...');
    fetch('http://localhost:8000/tipos-consumidores')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar tipos de consumidores: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            const list = document.getElementById('tiposConsumidoresList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            
            // Verificar se a resposta tem o formato esperado
            if (data.tipos_consumidores && Array.isArray(data.tipos_consumidores)) {
                data.tipos_consumidores.forEach(tipo => {
                    list.innerHTML += `
                        <li class="list-group-item m-2 p-2 border-bottom">
                            <div class="row d-flex justify-content-between">
                                <div class="col"> <strong>${tipo.nome}</strong></div>
                                <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${tipo.id}, '${tipo.nome}', ${tipo.valor_kwh})">Editar</button></div>
                                <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteTipoConsumidor(${tipo.id})">Deletar</button></div>
                            </div>
                        </li>`;
                });
            } else {
                list.innerHTML += '<li class="list-group-item">Nenhum tipo de consumidor encontrado</li>';
            }

            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao carregar tipos de consumidores. Verifique o console para mais detalhes.');
        });
}

function showAddForm() {
    document.getElementById('tipoConsumidorForm').classList.remove('d-none');
    document.getElementById('tipoConsumidorId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('valor_kwh').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Tipo de Consumidor';
}

function showEditForm(id, nome, valor_kwh) {
    document.getElementById('tipoConsumidorForm').classList.remove('d-none');
    document.getElementById('tipoConsumidorId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('valor_kwh').value = valor_kwh;
    document.getElementById('formTitle').innerText = 'Editar Tipo de Consumidor';
}

function saveTipoConsumidor() {
    const id = document.getElementById('tipoConsumidorId').value;
    const nome = document.getElementById('nome').value.trim();
    const valor_kwh = parseFloat(document.getElementById('valor_kwh').value.trim());

    console.log('ID:', id);
    console.log('Nome:', nome);
    console.log('Valor kWh:', valor_kwh);

    if (!nome || isNaN(valor_kwh)) {
        alert('Por favor, insira um nome válido e um valor kWh válido para o tipo de consumidor.');
        return;
    }

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/tipos-consumidores/${id}` : 'http://localhost:8000/tipos-consumidores';

    console.log('Método:', method);
    console.log('URL:', url);

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, valor_kwh: valor_kwh })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar o tipo de consumidor: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            console.log('Tipo de consumidor salvo com sucesso.');
            fetchTiposConsumidores();
            document.getElementById('tipoConsumidorForm').classList.add('d-none');
        })
        .catch(error => {
            console.error('Erro ao salvar tipo de consumidor:', error);
            alert('Erro ao salvar tipo de consumidor. Verifique o console para mais detalhes.');
        });
}

function deleteTipoConsumidor(id) {
    if (!confirm('Tem certeza que deseja deletar este tipo de consumidor?')) {
        return;
    }

    fetch(`http://localhost:8000/tipos-consumidores/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar o tipo de consumidor: ' + response.statusText);
            }
            fetchTiposConsumidores();
        })
        .catch(error => {
            console.error('Erro ao deletar tipo de consumidor:', error);
            alert('Erro ao deletar tipo de consumidor. Verifique o console para mais detalhes.');
        });
}
