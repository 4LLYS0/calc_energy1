document.addEventListener("DOMContentLoaded", function () {
    fetchBandeiras();

    document.getElementById('bandeiraFormElement').addEventListener('submit', function (event) {
        event.preventDefault();
        saveBandeira();
    });
});

function fetchBandeiras() {
    fetch('http://localhost:8000/bandeiras')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar bandeiras: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('bandeirasList');
            list.innerHTML = '<ul class="list-group border border-danger">';
            
            // Verificar se a resposta tem o formato esperado
            if (Array.isArray(data.bandeiras)) {
                data.bandeiras.forEach(bandeira => {
                    list.innerHTML += `
                        <li class="list-group-item m-2 p-2 border-bottom">
                            <div class="row d-flex justify-content-between">
                                <div class="col"> <strong>${bandeira.nome}</strong> - Tarifa: ${bandeira.tarifa}</div>
                                <div class="col"> <button class="btn btn-info btn-sm float-end ms-2" onclick="showEditForm(${bandeira.id}, '${bandeira.nome}', ${bandeira.tarifa})">Editar</button></div>
                                <div class="col"> <button class="btn btn-danger btn-sm float-end" onclick="deleteBandeira(${bandeira.id})">Deletar</button></div>
                            </div>
                        </li>`;
                });
            } else {
                list.innerHTML += '<li class="list-group-item">Nenhuma bandeira encontrada</li>';
            }

            list.innerHTML += '</ul>';
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao carregar bandeiras. Verifique o console para mais detalhes.');
        });
}

function showAddForm() {
    document.getElementById('bandeiraForm').classList.remove('d-none');
    document.getElementById('bandeiraId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('tarifa').value = '';
    document.getElementById('formTitle').innerText = 'Adicionar Bandeira Tarifária';
}

function showEditForm(id, nome, tarifa) {
    document.getElementById('bandeiraForm').classList.remove('d-none');
    document.getElementById('bandeiraId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('tarifa').value = tarifa;
    document.getElementById('formTitle').innerText = 'Editar Bandeira Tarifária';
}

function saveBandeira() {
    const id = document.getElementById('bandeiraId').value;
    const nome = document.getElementById('nome').value;
    const tarifa = parseFloat(document.getElementById('tarifa').value); // Certificar-se de que tarifa é um número

    if (isNaN(tarifa)) {
        alert('Por favor, insira um valor numérico válido para a tarifa.');
        return;
    }

    const method = id ? 'PATCH' : 'POST';
    const url = id ? `http://localhost:8000/bandeiras/${id}` : 'http://localhost:8000/bandeiras';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome: nome, tarifa: tarifa })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar a bandeira: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            fetchBandeiras();
            document.getElementById('bandeiraForm').classList.add('d-none');
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao salvar bandeira. Verifique o console para mais detalhes.');
        });
}

function deleteBandeira(id) {
    if (!confirm('Tem certeza que deseja deletar esta bandeira?')) {
        return;
    }

    fetch(`http://localhost:8000/bandeiras/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar a bandeira: ' + response.statusText);
            }
            fetchBandeiras();
        })
        .catch(error => {
            console.error(error);
            alert('Erro ao deletar bandeira. Verifique o console para mais detalhes.');
        });
}
