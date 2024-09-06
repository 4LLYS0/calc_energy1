document.addEventListener("DOMContentLoaded", function () {
    fetchDispositivos();

    document.getElementById('dispositivoFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveDispositivo();
    });
});

function fetchDispositivos() {
    fetch('http://localhost:8000/dispositivos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dispositivos: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('dispositivosList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            
            // Verificar se a resposta tem o formato esperado
            if (Array.isArray(data.dispositivos)) {
                data.dispositivos.forEach(dispositivo => {
                    list.innerHTML += `
                        <li class="list-group-item m-2 p-2 border-bottom">
                            <div class="row d-flex justify-content-between">
                                <div class="col"> <strong>${dispositivo.nome}</strong> - Tipo ID: ${dispositivo.tipo_id}</div>
                                <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${dispositivo.id}, '${dispositivo.nome}', ${dispositivo.tipo_id}, ${dispositivo.consumo}, ${dispositivo.uso_diario})">Editar</button></div>
                                <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteDispositivo(${dispositivo.id})">Deletar</button></div>
                            </div>
                        </li>`;
                });
            } else {
                list.innerHTML += '<li class="list-group-item">Nenhum dispositivo encontrado</li>';
            }

            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao carregar dispositivos. Verifique o console para mais detalhes.');
        });
}

function showAddForm() {
    document.getElementById('dispositivoForm').classList.remove('d-none');
    document.getElementById('dispositivoId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('consumo').value = '';
    document.getElementById('uso_diario').value = '';
    document.getElementById('tipo_id').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Dispositivo';
}

function showEditForm(id, nome, tipo_id, consumo, uso_diario) {
    document.getElementById('dispositivoForm').classList.remove('d-none');
    document.getElementById('dispositivoId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('tipo_id').value = tipo_id;
    document.getElementById('consumo').value = consumo;
    document.getElementById('uso_diario').value = uso_diario;
    document.getElementById('formTitle').innerText = 'Editar Dispositivo';
}

function saveDispositivo() {
    const id = document.getElementById('dispositivoId').value;
    const nome = document.getElementById('nome').value;
    const consumo = parseFloat(document.getElementById('consumo').value);
    const uso_diario = parseFloat(document.getElementById('uso_diario').value);
    const tipo_id = parseInt(document.getElementById('tipo_id').value);

    if (isNaN(consumo) || consumo <= 0) {
        alert('Por favor, insira um valor numérico válido para o consumo.');
        return;
    }

    if (isNaN(uso_diario) || uso_diario < 0 || uso_diario > 24) {
        alert('Por favor, insira um valor numérico válido para o uso diário (entre 0 e 24).');
        return;
    }

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/dispositivos/${id}` : 'http://localhost:8000/dispositivos';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, consumo: consumo, uso_diario: uso_diario, tipo_id: tipo_id })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar o dispositivo: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            fetchDispositivos();
            document.getElementById('dispositivoForm').classList.add('d-none');
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao salvar dispositivo. Verifique o console para mais detalhes.');
        });
}

function deleteDispositivo(id) {
    if (!confirm('Tem certeza que deseja deletar este dispositivo?')) {
        return;
    }

    fetch(`http://localhost:8000/dispositivos/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar o dispositivo: ' + response.statusText);
            }
            fetchDispositivos();
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao deletar dispositivo. Verifique o console para mais detalhes.');
        });
}
