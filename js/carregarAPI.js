// URL da API
const apiUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

// Função para obter os dados da API
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Mapear os dados para o formato desejado
        const mappedData = data.data.map(card => ({
            name: card.name,
            type: card.type,
            desc: card.desc,
            race: card.race,
            archetype: card.archetype,
            image_url: card.card_images[0].image_url
        }));

        // Transformar os dados em uma string
        const dataString = JSON.stringify(mappedData);

        // Exibir os dados na console
        console.log(dataString);

        // Retornar os dados
        return dataString;
    } catch (error) {
        console.error('Erro ao obter os dados da API:', error);
        return null;
    }
}

// Chamada da função para obter os dados
fetchData();


//---------------------------------------------------------------------------------//


// Função para embaralhar um array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para substituir as imagens nas cartas de maneira aleatória
function substituirImagens(images) {
    // Embaralhar as imagens
    const imagensEmbaralhadas = shuffleArray(images);

    // Iterar sobre as imagens embaralhadas e substituir nos elementos HTML
    for (let i = 0; i < imagensEmbaralhadas.length && i < 19; i++) {
        const imageUrl = imagensEmbaralhadas[i].image_url;
        const name = imagensEmbaralhadas[i].name;
        const type = imagensEmbaralhadas[i].type;
        const desc = imagensEmbaralhadas[i].desc;
        const race = imagensEmbaralhadas[i].race;
        const archetype = imagensEmbaralhadas[i].archetype;

        const bloco = document.getElementById(`Imagem${i + 1}`).closest('.bloco');
        if (bloco) {
            bloco.dataset.name = name;
            bloco.dataset.type = type;
            bloco.dataset.desc = desc;
            bloco.dataset.race = race;
            bloco.dataset.archetype = archetype;

            const imageElement = bloco.querySelector('img');
            if (imageElement) {
                imageElement.src = imageUrl;
            }
        }
    }
}


// Chamada da função para obter os dados da API e substituir as imagens
fetchData().then(data => {
    if (data) {
        const images = JSON.parse(data);
        substituirImagens(images);
    }
});

//--------------------------------------------------------------------------------


// Coletar os dados e criar um popup para exibir todas as descrições.
document.addEventListener('DOMContentLoaded', function () {
    const blocos = document.querySelectorAll('.bloco');

    blocos.forEach(bloco => {
        bloco.addEventListener('click', function () {
            const imageUrl = this.querySelector('img').src;
            const name = capitalizeFirstLetter(this.dataset.name !== 'undefined' ? this.dataset.name : 'Not applicable');
            const type = capitalizeFirstLetter(this.dataset.type !== 'undefined' ? this.dataset.type : 'Not applicable');
            const desc = capitalizeFirstLetter(this.dataset.desc !== 'undefined' ? this.dataset.desc : 'Not applicable');
            const race = capitalizeFirstLetter(this.dataset.race !== 'undefined' ? this.dataset.race : 'Not applicable');
            const archetype = capitalizeFirstLetter(this.dataset.archetype !== 'undefined' ? this.dataset.archetype : 'Not applicable');

            // Criar o elemento de pop-up
            const popup = document.createElement('div');
            popup.classList.add('popup');

            // Criar a imagem em destaque
            const imagemDestaque = document.createElement('img');
            imagemDestaque.src = imageUrl;
            imagemDestaque.classList.add('imagem-destaque');

            // Adicionar a imagem em destaque ao pop-up
            popup.appendChild(imagemDestaque);

            // Criar e adicionar os elementos de texto ao pop-up
            const texto = document.createElement('div');
            texto.classList.add('texto-descrição');
            texto.innerHTML = `
                <p style="font-family: sans-serif;"><strong>Nome:</strong> ${name}</p>
                <p style="font-family: sans-serif;"><strong>Tipo:</strong> ${type}</p>
                <p style="font-family: sans-serif;"><strong>Descrição:</strong></p>
                <p style="font-family: sans-serif; white-space: pre-wrap;">${desc}</p>
                <p style="font-family: sans-serif;"><strong>Raça:</strong> ${race}</p>
                <p style="font-family: sans-serif;"><strong>Arquétipo:</strong> ${archetype}</p>
            `;

            popup.appendChild(texto);

            // Adicionar o pop-up ao body
            document.body.appendChild(popup);

            // Fechar o pop-up ao clicar fora dele
            popup.addEventListener('click', function () {
                document.body.removeChild(popup);
            });
        });
    });
});

// Função para capitalizar a primeira letra de uma string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}




//------------------------------------------------//

// Função para buscar os dados da API e substituir as imagens ao clicar no botão.
async function atualizarDados() {
    try {
        // Resetar as imagens para "/assets/carta.jpg"
        for (let i = 1; i <= 19; i++) {
            const bloco = document.getElementById(`Imagem${i}`).closest('.bloco');
            if (bloco) {
                const imageElement = bloco.querySelector('img');
                if (imageElement) {
                    imageElement.src = '/assets/carta.jpg';
                }
            }
        }

        // Buscar os novos dados da API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Mapear os dados para o formato desejado
        const mappedData = data.data.map(card => ({
            name: card.name,
            type: card.type,
            desc: card.desc,
            race: card.race,
            archetype: card.archetype,
            image_url: card.card_images[0].image_url
        }));

        // Substituir as imagens com os novos dados
        substituirImagens(mappedData);
    } catch (error) {
        console.error('Erro ao obter os dados da API:', error);
    }
}

// Adicionar evento de clique ao botão de atualizar
const atualizarBtn = document.getElementById('atualizar');
atualizarBtn.addEventListener('click', atualizarDados);


//------------------------------------------------------------------------------//

document.addEventListener('DOMContentLoaded', function () {
    const conteudoPesquisa = document.getElementById('conteudo-pesquisa');
    const blocos = document.querySelectorAll('.bloco');
    let dataString = ''; // Variável global para armazenar os dados da API

    // Função para obter os dados da API
    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Mapear os dados para o formato desejado e converter para minúsculas
            const mappedData = data.data.map(card => ({
                name: card.name.toLowerCase(), // Convertendo para minúsculas
                type: card.type,
                desc: card.desc,
                race: card.race,
                archetype: card.archetype,
                image_url: card.card_images[0].image_url
            }));

            // Armazenar os dados em dataString
            dataString = JSON.stringify(mappedData);

            // Exibir todas as imagens inicialmente
            substituirImagens(mappedData);
        } catch (error) {
            console.error('Erro ao obter os dados da API:', error);
        }
    }

// Função para filtrar e exibir as cartas com base no termo de pesquisa
function filtrarPesquisa(termoPesquisa) {
    const imagensFiltradas = JSON.parse(dataString).filter(card => card.name.includes(termoPesquisa));
    const blocos = document.querySelectorAll('.bloco');
    let cartasEncontradas = false;

    blocos.forEach(bloco => {
        const name = bloco.dataset.name.toLowerCase();
        if (name.includes(termoPesquisa)) {
            bloco.style.display = 'block'; // Exibir o bloco se corresponder ao termo de pesquisa
            cartasEncontradas = true;
        } else {
            bloco.style.display = 'none'; // Ocultar o bloco se não corresponder ao termo de pesquisa
        }
    });

    // Exibir mensagem se nenhuma carta corresponder ao termo de pesquisa
    const mensagemErro = document.getElementById('mensagemErro');
    if (!cartasEncontradas) {
        if (!mensagemErro) {
            const mensagem = document.createElement('p');
            mensagem.textContent = 'Parece que nenhuma carta possui esse nome, verifique a escrita e lembre-se que deve ser somente o nome em inglês.';
            mensagem.style.color = 'red';
            mensagem.style.textAlign = 'center';
            mensagem.id = 'mensagemErro';

            const main = document.querySelector('main');
            main.appendChild(mensagem);
        }
    } else {
        if (mensagemErro) {
            mensagemErro.remove(); // Remover mensagem de erro se cartas forem encontradas
        }
    }

    // Substituir as imagens com base nos dados filtrados
    substituirImagens(imagensFiltradas);
}


    // Função para limpar a caixa de pesquisa e exibir todas as imagens novamente
    function limparPesquisa() {
        const blocos = document.querySelectorAll('.bloco');
        blocos.forEach(bloco => {
            bloco.style.display = 'block'; // Exibir todos os blocos
        });
        substituirImagens(JSON.parse(dataString)); // Substituir as imagens com os dados completos
        conteudoPesquisa.value = ''; // Limpar o campo de pesquisa
    }

    conteudoPesquisa.addEventListener('input', function () {
        const termoPesquisa = conteudoPesquisa.value.trim().toLowerCase();
    
        if (termoPesquisa !== '') {
            filtrarPesquisa(termoPesquisa);
        } else {
            limparPesquisa();
        }
    });

    // Chamar a função para obter os dados da API ao carregar a página
    fetchData();
});
