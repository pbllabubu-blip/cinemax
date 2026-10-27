let conteudos = JSON.parse(
    localStorage.getItem("conteudos")
) || JSON.parse(
    localStorage.getItem("filmes")
) || [];

// ==========================================
// ELEMENTOS
// ==========================================

const btnNovoConteudo = document.getElementById("btnNovoConteudo");

const modal = document.getElementById("modal");
const modalDescricao = document.getElementById("modalDescricao");

const formConteudo = document.getElementById("formConteudo");

const tituloModal = document.getElementById("tituloModal");

const nome = document.getElementById("nome");
const ano = document.getElementById("ano");
const diretor = document.getElementById("diretor");
const nota = document.getElementById("nota");
const capa = document.getElementById("capa");
const descricao = document.getElementById("descricao");

const temporadas = document.getElementById("temporadas");
const episodios = document.getElementById("episodios");

const dadosSerie = document.getElementById("dadosSerie");

const pesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtroTipo");
const filtroGenero = document.getElementById("filtroGenero");

const listaConteudos = document.getElementById("listaConteudos");

const checkOutroGenero = document.getElementById("checkOutroGenero");
const generoPersonalizado = document.getElementById("generoPersonalizado");

const btnCancelar = document.getElementById("btnCancelar");
const btnFecharModal = document.getElementById("btnFecharModal");

const fecharDescricao = document.getElementById("fecharDescricao");

const tituloDescricao = document.getElementById("tituloDescricao");
const textoDescricao = document.getElementById("textoDescricao");

// ==========================================
// MIGRAÇÃO DOS DADOS ANTIGOS
// ==========================================

conteudos = conteudos.map(item => {

    return {
        id: item.id || Date.now() + Math.random(),

        tipo: item.tipo || "filme",

        nome: item.nome || "",

        generos: Array.isArray(item.generos)
            ? item.generos
            : item.genero
                ? [item.genero]
                : [],

        ano: item.ano || "",

        diretor: item.diretor || "",

        nota: Number(item.nota) || 0,

        temporadas: item.temporadas || "",

        episodios: item.episodios || "",

        capa: item.capa || "",

        descricao: item.descricao || ""
    };

});

salvarDados();

// ==========================================
// SALVAR
// ==========================================

function salvarDados() {

    localStorage.setItem(
        "conteudos",
        JSON.stringify(conteudos)
    );

}

// ==========================================
// MODAL
// ==========================================

function abrirModal() {

    modal.classList.add("ativo");

}

function fecharModal() {

    modal.classList.remove("ativo");

    formConteudo.reset();

    document.querySelector(
        'input[name="tipo"][value="filme"]'
    ).checked = true;

    tituloModal.textContent = "Novo conteúdo";

    dadosSerie.classList.remove("ativo");

    generoPersonalizado.classList.remove("ativo");

    generoPersonalizado.value = "";

    limparGeneros();

    formConteudo.removeAttribute("data-id");

}

// ==========================================
// TIPO
// ==========================================

document.querySelectorAll(
    'input[name="tipo"]'
).forEach(input => {

    input.addEventListener("change", atualizarTipo);

});

function atualizarTipo() {

    const tipo = document.querySelector(
        'input[name="tipo"]:checked'
    ).value;

    if (tipo === "serie") {

        dadosSerie.classList.add("ativo");

    } else {

        dadosSerie.classList.remove("ativo");

    }

}

// ==========================================
// GÊNEROS
// ==========================================

function pegarGenerosSelecionados() {

    const generos = [];

    document.querySelectorAll(
        ".check-genero:checked"
    ).forEach(check => {

        generos.push(check.value);

    });

    if (
        checkOutroGenero.checked &&
        generoPersonalizado.value.trim()
    ) {

        generos.push(
            generoPersonalizado.value.trim()
        );

    }

    return generos;

}

function limparGeneros() {

    document.querySelectorAll(
        ".check-genero"
    ).forEach(check => {

        check.checked = false;

    });

    checkOutroGenero.checked = false;

}

checkOutroGenero.addEventListener(
    "change",
    () => {

        if (checkOutroGenero.checked) {

            generoPersonalizado.classList.add("ativo");

        } else {

            generoPersonalizado.classList.remove("ativo");

            generoPersonalizado.value = "";

        }

    }
);

// ==========================================
// NOVO
// ==========================================

btnNovoConteudo.addEventListener(
    "click",
    () => {

        fecharModal();

        abrirModal();

    }
);

// ==========================================
// FORMULÁRIO
// ==========================================

formConteudo.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const tipo = document.querySelector(
            'input[name="tipo"]:checked'
        ).value;

        const generos = pegarGenerosSelecionados();

        if (generos.length === 0) {

            alert("Selecione pelo menos um gênero.");

            return;

        }

        const id = formConteudo.dataset.id;

        const dados = {

            id: id
                ? Number(id)
                : Date.now(),

            tipo: tipo,

            nome: nome.value.trim(),

            generos: generos,

            ano: ano.value,

            diretor: diretor.value.trim(),

            nota: Number(nota.value) || 0,

            temporadas:
                tipo === "serie"
                    ? temporadas.value
                    : "",

            episodios:
                tipo === "serie"
                    ? episodios.value
                    : "",

            capa: capa.value.trim(),

            descricao: descricao.value.trim()

        };

        if (id) {

            const index = conteudos.findIndex(
                item => item.id === Number(id)
            );

            if (index !== -1) {

                conteudos[index] = dados;

            }

        } else {

            conteudos.push(dados);

        }

        salvarDados();

        atualizarSistema();

        fecharModal();

    }
);

// ==========================================
// EDITAR
// ==========================================

function editarConteudo(id) {

    const conteudo = conteudos.find(
        item => item.id === id
    );

    if (!conteudo) return;

    tituloModal.textContent = "Editar conteúdo";

    formConteudo.dataset.id = id;

    document.querySelector(
        `input[name="tipo"][value="${conteudo.tipo}"]`
    ).checked = true;

    nome.value = conteudo.nome;

    ano.value = conteudo.ano;

    diretor.value = conteudo.diretor;

    nota.value = conteudo.nota;

    temporadas.value = conteudo.temporadas || "";

    episodios.value = conteudo.episodios || "";

    capa.value = conteudo.capa;

    descricao.value = conteudo.descricao;

    limparGeneros();

    document.querySelectorAll(
        ".check-genero"
    ).forEach(check => {

        if (
            conteudo.generos.includes(check.value)
        ) {

            check.checked = true;

        }

    });

    const generosPersonalizados =
        conteudo.generos.filter(genero => {

            return !Array.from(
                document.querySelectorAll(".check-genero")
            ).some(
                check => check.value === genero
            );

        });

    if (generosPersonalizados.length > 0) {

        checkOutroGenero.checked = true;

        generoPersonalizado.classList.add("ativo");

        generoPersonalizado.value =
            generosPersonalizados[0];

    } else {

        checkOutroGenero.checked = false;

        generoPersonalizado.classList.remove("ativo");

        generoPersonalizado.value = "";

    }

    atualizarTipo();

    abrirModal();

}

// ==========================================
// EXCLUIR
// ==========================================

function excluirConteudo(id) {

    const conteudo = conteudos.find(
        item => item.id === id
    );

    if (!conteudo) return;

    const confirmar = confirm(
        `Deseja excluir "${conteudo.nome}"?`
    );

    if (!confirmar) return;

    conteudos = conteudos.filter(
        item => item.id !== id
    );

    salvarDados();

    atualizarSistema();

}

// ==========================================
// DESCRIÇÃO
// ==========================================

function verDescricao(id) {

    const conteudo = conteudos.find(
        item => item.id === id
    );

    if (!conteudo) return;

    tituloDescricao.textContent =
        conteudo.nome;

    textoDescricao.textContent =
        conteudo.descricao ||
        "Nenhuma descrição cadastrada.";

    modalDescricao.classList.add("ativo");

}

// ==========================================
// TAGS
// ==========================================

function criarTagsGeneros(generos) {

    return generos.map(genero => {

        return `
            <span class="tag">
                ${escaparHTML(genero)}
            </span>
        `;

    }).join("");

}

// ==========================================
// RENDERIZAR
// ==========================================

function renderizarConteudos() {

    const texto = pesquisa.value
        .toLowerCase()
        .trim();

    const tipoSelecionado =
        filtroTipo.value;

    const generoSelecionado =
        filtroGenero.value;

    const filtrados = conteudos.filter(
        conteudo => {

            const batePesquisa =
                conteudo.nome
                    .toLowerCase()
                    .includes(texto) ||

                conteudo.diretor
                    .toLowerCase()
                    .includes(texto);

            const bateTipo =
                tipoSelecionado === "todos" ||
                conteudo.tipo === tipoSelecionado;

            const bateGenero =
                generoSelecionado === "todos" ||
                conteudo.generos.includes(
                    generoSelecionado
                );

            return (
                batePesquisa &&
                bateTipo &&
                bateGenero
            );

        }
    );

    listaConteudos.innerHTML = "";

    if (filtrados.length === 0) {

        listaConteudos.innerHTML = `
            <div class="mensagem-vazia">

                <strong>
                    Nenhum conteúdo encontrado
                </strong>

                <span>
                    Tente mudar os filtros ou cadastrar um novo título.
                </span>

            </div>
        `;

        return;

    }

    filtrados.forEach(conteudo => {

        const card = document.createElement("article");

        card.className = "card";

        const tipoTexto =
            conteudo.tipo === "serie"
                ? "📺 Série"
                : "🎬 Filme";

        const dadosExtras =
            conteudo.tipo === "serie"

                ? `
                    📅 ${conteudo.ano || "Ano não informado"}
                    <br>
                    📚 ${conteudo.temporadas || "?"} temporada(s)
                    • 🎞️ ${conteudo.episodios || "?"} episódio(s)
                `

                : `
                    📅 ${conteudo.ano || "Ano não informado"}
                `;

        const capaImagem =
            conteudo.capa ||
            "https://via.placeholder.com/500x700/111925/ffffff?text=Sem+Capa";

        card.innerHTML = `

            <img
                class="card-capa"
                src="${escaparHTML(capaImagem)}"
                alt="${escaparHTML(conteudo.nome)}"
                onerror="this.src='https://via.placeholder.com/500x700/111925/ffffff?text=Sem+Capa'"
            >

            <div class="card-info">

                <div class="card-topo">

                    <h3>
                        ${escaparHTML(conteudo.nome)}
                    </h3>

                    <span class="tipo-badge">
                        ${tipoTexto}
                    </span>

                </div>

                <div class="tags">
                    ${criarTagsGeneros(conteudo.generos)}
                </div>

                <p class="info">
                    ${dadosExtras}
                </p>

                <p class="info">
                    🎥 ${escaparHTML(
                        conteudo.diretor ||
                        "Não informado"
                    )}
                </p>

                <p class="info nota">
                    ⭐ ${conteudo.nota.toFixed(1)}
                </p>

                <p class="descricao">
                    ${escaparHTML(
                        conteudo.descricao ||
                        "Nenhuma descrição cadastrada."
                    )}
                </p>

                <button
                    class="btn-descricao"
                    onclick="verDescricao(${conteudo.id})"
                >
                    📖 Ver descrição
                </button>

                <div class="card-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarConteudo(${conteudo.id})"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirConteudo(${conteudo.id})"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            </div>
        `;

        listaConteudos.appendChild(card);

    });

}

// ==========================================
// GÊNEROS DO FILTRO
// ==========================================

function atualizarGeneros() {

    const generos = new Set();

    conteudos.forEach(conteudo => {

        conteudo.generos.forEach(genero => {

            generos.add(genero);

        });

    });

    const valorAtual = filtroGenero.value;

    filtroGenero.innerHTML = `
        <option value="todos">
            Todos os gêneros
        </option>
    `;

    Array.from(generos)
        .sort()
        .forEach(genero => {

            const option =
                document.createElement("option");

            option.value = genero;

            option.textContent = genero;

            filtroGenero.appendChild(option);

        });

    if (
        Array.from(filtroGenero.options)
            .some(option => option.value === valorAtual)
    ) {

        filtroGenero.value = valorAtual;

    }

}

// ==========================================
// DASHBOARD
// ==========================================

function atualizarDashboard() {

    const total =
        conteudos.length;

    const filmes =
        conteudos.filter(
            item => item.tipo === "filme"
        ).length;

    const series =
        conteudos.filter(
            item => item.tipo === "serie"
        ).length;

    const notas = conteudos
        .map(item => Number(item.nota))
        .filter(nota => nota > 0);

    const media =
        notas.length > 0
            ? notas.reduce(
                (total, nota) => total + nota,
                0
            ) / notas.length
            : 0;

    document.getElementById(
        "totalConteudos"
    ).textContent = total;

    document.getElementById(
        "totalFilmes"
    ).textContent = filmes;

    document.getElementById(
        "totalSeries"
    ).textContent = series;

    document.getElementById(
        "mediaNotas"
    ).textContent = media.toFixed(1);

}

// ==========================================
// SISTEMA
// ==========================================

function atualizarSistema() {

    atualizarDashboard();

    atualizarGeneros();

    renderizarConteudos();

}

// ==========================================
// EVENTOS DE FILTRO
// ==========================================

pesquisa.addEventListener(
    "input",
    renderizarConteudos
);

filtroTipo.addEventListener(
    "change",
    renderizarConteudos
);

filtroGenero.addEventListener(
    "change",
    renderizarConteudos
);

// ==========================================
// FECHAR MODAIS
// ==========================================

btnCancelar.addEventListener(
    "click",
    fecharModal
);

btnFecharModal.addEventListener(
    "click",
    fecharModal
);

fecharDescricao.addEventListener(
    "click",
    () => {

        modalDescricao.classList.remove(
            "ativo"
        );

    }
);

modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {

            fecharModal();

        }

    }
);

modalDescricao.addEventListener(
    "click",
    event => {

        if (event.target === modalDescricao) {

            modalDescricao.classList.remove(
                "ativo"
            );

        }

    }
);

// ==========================================
// ESC
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            fecharModal();

            modalDescricao.classList.remove(
                "ativo"
            );

        }

    }
);

// ==========================================
// SEGURANÇA HTML
// ==========================================

function escaparHTML(valor) {

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

// ==========================================
// INICIAR
// ==========================================

atualizarSistema();