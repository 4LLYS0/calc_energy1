document.addEventListener("DOMContentLoaded", function () {
    fetchTiposDispositivos();

    document.getElementById('tipoDispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveTipoDispositivo();
    });
});

function fetchTiposDispositivos() {
    console.log('Fetching tipos de dispositivos...');
    fetch('http://localhost:8000/tipos-dispositivos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar tipos de dispositivos: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos:', data);
            const list = document.getElementById('tiposDispositivosList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            
            // Verificar se a resposta tem o formato esperado
            if (data.tipos_dispositivos && Array.isArray(data.tipos_dispositivos)) {
                data.tipos_dispositivos.forEach(tipo => {
                    list.innerHTML += `
                        <li class="list-group-item m-2 p-2 border-bottom">
                            <div class="row d-flex justify-content-between">
                                <div class="col"> <strong>${tipo.nome}</strong></div>
                                <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${tipo.id}, '${tipo.nome}')">Editar</button></div>
                                <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteTipoDispositivo(${tipo.id})">Deletar</button></div>
                            </div>
                        </li>`;
                });
            } else {
                list.innerHTML += '<li class="list-group-item">Nenhum tipo de dispositivo encontrado</li>';
            }

            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao carregar tipos de dispositivos. Verifique o console para mais detalhes.');
        });
}

function showAddForm() {
    document.getElementById('tipoDispositivoForm').classList.remove('d-none');
    document.getElementById('tipoDispositivoId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Tipo de Dispositivo';
}

function showEditForm(id, nome) {
    document.getElementById('tipoDispositivoForm').classList.remove('d-none');
    document.getElementById('tipoDispositivoId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Tipo de Dispositivo';
}

function saveTipoDispositivo() {
    const id = document.getElementById('tipoDispositivoId').value;
    const nome = document.getElementById('nome').value.trim();

    console.log('ID:', id);
    console.log('Nome:', nome);

    if (!nome) {
        alert('Por favor, insira um nome válido para o tipo de dispositivo.');
        return;
    }

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/tipos-dispositivos/${id}` : 'http://localhost:8000/tipos-dispositivos';

    console.log('Método:', method);
    console.log('URL:', url);

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar o tipo de dispositivo: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            console.log('Tipo de dispositivo salvo com sucesso.');
            fetchTiposDispositivos();
            document.getElementById('tipoDispositivoForm').classList.add('d-none');
        })
        .catch(error => {
            console.error('Erro ao salvar tipo de dispositivo:', error);
            alert('Erro ao salvar tipo de dispositivo. Verifique o console para mais detalhes.');
        });
}

function deleteTipoDispositivo(id) {
    if (!confirm('Tem certeza que deseja deletar este tipo de dispositivo?')) {
        return;
    }

    fetch(`http://localhost:8000/tipos-dispositivos/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar o tipo de dispositivo: ' + response.statusText);
            }
            fetchTiposDispositivos();
        })
        .catch(error => {
            console.error('Erro ao deletar tipo de dispositivo:', error);
            alert('Erro ao deletar tipo de dispositivo. Verifique o console para mais detalhes.');
        });
}
