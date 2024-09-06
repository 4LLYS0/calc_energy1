document.addEventListener("DOMContentLoaded", function () {
    fetchDependencias();
    fetchBandeiras();

    document.getElementById('dependenciaFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDependencia();
    });
});

function fetchDependencias() {
    fetch('http://localhost:8000/dependencias')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dependências: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('dependenciasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            
            if (Array.isArray(data.dependencias)) {
                data.dependencias.forEach(dependencia => {
                    list.innerHTML += `
                        <li class="list-group-item m-2 p-2 border-bottom">
                            <div class="row d-flex justify-content-between">
                                <div class="col"> <strong>${dependencia.nome}</strong></div>
                                <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${dependencia.id}, '${dependencia.nome}', ${JSON.stringify(dependencia.bandeiras)})">Editar</button></div>
                                <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteDependencia(${dependencia.id})">Deletar</button></div>
                            </div>
                        </li>`;
                });
            } else {
                list.innerHTML += '<li class="list-group-item">Nenhuma dependência encontrada</li>';
            }

            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao carregar dependências. Verifique o console para mais detalhes.');
        });
}

function fetchBandeiras() {
    fetch('http://localhost:8000/bandeiras')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar bandeiras: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById('bandeiras');
            select.innerHTML = '';
            
            if (Array.isArray(data.bandeiras)) {
                data.bandeiras.forEach(bandeira => {
                    select.innerHTML += `
                        <option value="${bandeira.id}">${bandeira.tipo}</option>`;
                });
            } else {
                select.innerHTML = '<option value="">Nenhuma bandeira encontrada</option>';
            }
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao carregar bandeiras. Verifique o console para mais detalhes.');
        });
}

function showAddForm() {
    document.getElementById('dependenciaForm').classList.remove('d-none');
    document.getElementById('dependenciaId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('bandeiras').value = [];
    document.getElementById('formTitle').innerText = 'Adicionar Dependência';
}

function showEditForm(id, nome, bandeiras) {
    document.getElementById('dependenciaForm').classList.remove('d-none');
    document.getElementById('dependenciaId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('formTitle').innerText = 'Editar Dependência';

    // Carregar e selecionar bandeiras associadas
    const select = document.getElementById('bandeiras');
    Array.from(select.options).forEach(option => {
        option.selected = bandeiras.includes(parseInt(option.value));
    });
}

function saveDependencia() {
    const id = document.getElementById('dependenciaId').value;
    const nome = document.getElementById('nome').value;
    const bandeiras = Array.from(document.getElementById('bandeiras').selectedOptions).map(option => option.value);

    if (!nome) {
        alert('Por favor, insira todos os campos necessários.');
        return;
    }

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/dependencias/${id}` : 'http://localhost:8000/dependencias';

    const requestData = { nome: nome, bandeiras: bandeiras };

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json().then(data => {
        if (!response.ok) {
            console.error('Erro:', data);
            throw new Error(data.detail || 'Erro desconhecido ao salvar a dependência');
        }
        return data;
    }))
    .then(() => {
        fetchDependencias();
        document.getElementById('dependenciaForm').classList.add('d-none');
    })
    .catch(error => {
        console.error(error);
        alert('Erro ao salvar dependência. Verifique o console para mais detalhes.');
    });
}

function deleteDependencia(id) {
    if (!confirm('Tem certeza que deseja deletar esta dependência?')) {
        return;
    }

    fetch(`http://localhost:8000/dependencias/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar a dependência: ' + response.statusText);
            }
            fetchDependencias();
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao deletar dependência. Verifique o console para mais detalhes.');
        });
}
