// ---------- FIREBASE (opcional) ----------
  const firebaseConfig = {
    apiKey: "INSIRA_SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID"
  };

  let db = null, auth = null, useFirebase = false;

  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "INSIRA_SUA_API_KEY") {
    try {
      firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      db   = firebase.firestore();
      useFirebase = true;
      auth.signInAnonymously().catch(e => console.warn("Firebase anônimo falhou", e));
    } catch(e) {
      console.warn("Firebase erro, usando localStorage", e);
    }
  }

  // ---------- HELPER ----------
  function escapeHtml(str) {
    return str.replace(/[&<>]/g, m =>
      m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'
    );
  }

  // ==========================================================
  //  DICIONÁRIO DE ITENS
  //
  //  Campos por tipo:
  //    - Compras:    { valorReal, tempoMinimo }
  //      valorReal   → preço de mercado aproximado em R$
  //      tempoMinimo → meses mínimos realistas (floor de credibilidade)
  //
  //    - Desafios:   { dificuldade, mesesBase }
  //      mesesBase  → tempo base em meses (escala humana real)
  // ==========================================================
  const COMPRAS = {
    // ---- CARROS ----
    carro: {
      mobi:       { valorReal:  65000, tempoMinimo:  6 },
      uno:        { valorReal:  70000, tempoMinimo:  6 },
      kwid:       { valorReal:  72000, tempoMinimo:  6 },
      ka:         { valorReal:  73000, tempoMinimo:  6 },
      palio:      { valorReal:  75000, tempoMinimo:  6 },
      celta:      { valorReal:  40000, tempoMinimo:  4 },  // usado comum
      argo:       { valorReal:  85000, tempoMinimo:  7 },
      onix:       { valorReal:  90000, tempoMinimo:  8 },
      hb20:       { valorReal:  88000, tempoMinimo:  7 },
      gol:        { valorReal:  85000, tempoMinimo:  7 },
      polo:       { valorReal: 110000, tempoMinimo:  9 },
      corsa:      { valorReal:  50000, tempoMinimo:  5 },
      c3:         { valorReal: 100000, tempoMinimo:  8 },
      nivus:      { valorReal: 110000, tempoMinimo:  9 },
      tracker:    { valorReal: 120000, tempoMinimo: 10 },
      cronos:     { valorReal:  95000, tempoMinimo:  8 },
      virtus:     { valorReal: 120000, tempoMinimo: 10 },
      c4:         { valorReal: 130000, tempoMinimo: 10 },
      "t-cross":  { valorReal: 130000, tempoMinimo: 10 },
      civic:      { valorReal: 190000, tempoMinimo: 14 },
      corolla:    { valorReal: 175000, tempoMinimo: 12 },
      jetta:      { valorReal: 165000, tempoMinimo: 12 },
      sentra:     { valorReal: 160000, tempoMinimo: 12 },
      compass:    { valorReal: 175000, tempoMinimo: 12 },
      renegade:   { valorReal: 155000, tempoMinimo: 12 },
      toro:       { valorReal: 165000, tempoMinimo: 12 },
      s10:        { valorReal: 230000, tempoMinimo: 18 },
      hilux:      { valorReal: 280000, tempoMinimo: 20 },
      ranger:     { valorReal: 270000, tempoMinimo: 20 },
      frontier:   { valorReal: 260000, tempoMinimo: 18 },
      amarok:     { valorReal: 330000, tempoMinimo: 24 },
      a3:         { valorReal: 220000, tempoMinimo: 16 },
      a4:         { valorReal: 290000, tempoMinimo: 24 },
      a5:         { valorReal: 360000, tempoMinimo: 30 },
      a6:         { valorReal: 450000, tempoMinimo: 36 },
      a7:         { valorReal: 550000, tempoMinimo: 42 },
      a8:         { valorReal: 750000, tempoMinimo: 48 },
      x1:         { valorReal: 320000, tempoMinimo: 24 },
      x3:         { valorReal: 420000, tempoMinimo: 36 },
      m3:         { valorReal: 600000, tempoMinimo: 48 },
      m135:       { valorReal: 350000, tempoMinimo: 30 },
      bmw_320:    { valorReal: 350000, tempoMinimo: 30 },
      bmw_x5:     { valorReal: 620000, tempoMinimo: 48 },
      classe_c:   { valorReal: 320000, tempoMinimo: 24 },
      classe_e:   { valorReal: 520000, tempoMinimo: 42 },
      glc:        { valorReal: 480000, tempoMinimo: 36 },
      audi_q3:    { valorReal: 320000, tempoMinimo: 24 },
      audi_q5:    { valorReal: 450000, tempoMinimo: 36 },
      volvo_xc40: { valorReal: 370000, tempoMinimo: 30 },
      mustang:    { valorReal: 450000, tempoMinimo: 36 },
      camaro:     { valorReal: 520000, tempoMinimo: 42 },
      charger:    { valorReal: 600000, tempoMinimo: 48 },
      corvette:   { valorReal: 900000, tempoMinimo: 60 },
      porsche_911:{ valorReal:1100000, tempoMinimo: 72 },
      ferrari:    { valorReal:3500000, tempoMinimo:120 },
      lamborghini:{ valorReal:4000000, tempoMinimo:120 },
      mclaren:    { valorReal:3000000, tempoMinimo:120 },
      bugatti:    { valorReal:15000000,tempoMinimo:240 },
      rolls_royce:{ valorReal:5000000, tempoMinimo:180 },
      bentley:    { valorReal:3500000, tempoMinimo:120 },
      ram:        { valorReal: 450000, tempoMinimo: 36 },
    },

    // ---- CELULARES ----
    celular: {
      iphone10:   { valorReal:  1500, tempoMinimo: 1 },
      iphone11:   { valorReal:  2200, tempoMinimo: 1 },
      iphone12:   { valorReal:  3000, tempoMinimo: 1 },
      iphone13:   { valorReal:  4000, tempoMinimo: 2 },
      iphone14:   { valorReal:  5500, tempoMinimo: 2 },
      iphone15:   { valorReal:  7000, tempoMinimo: 2 },
      iphone16:   { valorReal:  8500, tempoMinimo: 3 },
      iphone17:   { valorReal: 10000, tempoMinimo: 3 },
      a14:        { valorReal:  1200, tempoMinimo: 1 },
      a34:        { valorReal:  1800, tempoMinimo: 1 },
      a54:        { valorReal:  2500, tempoMinimo: 1 },
      a73:        { valorReal:  3000, tempoMinimo: 1 },
      s23:        { valorReal:  5000, tempoMinimo: 2 },
      s23_ultra:  { valorReal:  8000, tempoMinimo: 3 },
      s24:        { valorReal:  6000, tempoMinimo: 2 },
      s24_ultra:  { valorReal:  9000, tempoMinimo: 3 },
    },

    // ---- COMPUTADORES ----
    computador: {
      pc:         { valorReal:  3500, tempoMinimo: 1 },
      computador: { valorReal:  3500, tempoMinimo: 1 },
      notebook:   { valorReal:  4000, tempoMinimo: 1 },
      pc_gamer:   { valorReal:  7000, tempoMinimo: 2 },
      samsung:    { valorReal:  5000, tempoMinimo: 2 },
      macbook:    { valorReal: 12000, tempoMinimo: 3 },
    },

    // ---- ESTILO DE VIDA ----
    estiloDeVida: {
      academia:         { valorReal:    80, tempoMinimo: 1 },
      suplemento:       { valorReal:   150, tempoMinimo: 1 },
      whey:             { valorReal:   150, tempoMinimo: 1 },
      creatina:         { valorReal:    80, tempoMinimo: 1 },
      dieta:            { valorReal:   500, tempoMinimo: 1 },
      personal_trainer: { valorReal:   800, tempoMinimo: 1 },
      roupas_estilosas: { valorReal:  2000, tempoMinimo: 1 },
      tenis:            { valorReal:   800, tempoMinimo: 1 },
      perfume:          { valorReal:   600, tempoMinimo: 1 },
      skincare:         { valorReal:   400, tempoMinimo: 1 },
    },

    // ---- MORADIA ----
    moradia: {
      casa:        { valorReal:  350000, tempoMinimo: 36 },
      apartamento: { valorReal:  280000, tempoMinimo: 24 },
      chacara:     { valorReal:  500000, tempoMinimo: 48 },
    },

    // ---- ROUPAS ----
    roupas: {
      blusa_masculina:  { valorReal:   80, tempoMinimo: 1 },
      blusa_feminina:   { valorReal:   90, tempoMinimo: 1 },
      camiseta_masculina:{ valorReal:  60, tempoMinimo: 1 },
      camiseta_feminina:{ valorReal:   60, tempoMinimo: 1 },
      vestido:          { valorReal:  200, tempoMinimo: 1 },
      shorts:           { valorReal:   70, tempoMinimo: 1 },
      calca:            { valorReal:  200, tempoMinimo: 1 },
      cueca:            { valorReal:   30, tempoMinimo: 1 },
      calcinha:         { valorReal:   30, tempoMinimo: 1 },
      sutia:            { valorReal:   60, tempoMinimo: 1 },
      luva:             { valorReal:   50, tempoMinimo: 1 },
      meia:             { valorReal:   20, tempoMinimo: 1 },
      gorro:            { valorReal:   80, tempoMinimo: 1 },
    },

    // ---- VIAGENS ----
    viajar: {
      // custo estimado de viagem individual (passagem + hospedagem + gastos)
      franca:          { valorReal: 15000, tempoMinimo: 3 },
      estados_unidos:  { valorReal: 12000, tempoMinimo: 3 },
      eua:             { valorReal: 12000, tempoMinimo: 3 },
      china:           { valorReal: 14000, tempoMinimo: 3 },
      espanha:         { valorReal: 13000, tempoMinimo: 3 },
      mexico:          { valorReal:  8000, tempoMinimo: 2 },
      italia:          { valorReal: 16000, tempoMinimo: 3 },
      polonia:         { valorReal:  9000, tempoMinimo: 2 },
      hungria:         { valorReal:  9000, tempoMinimo: 2 },
      croacia:         { valorReal: 12000, tempoMinimo: 3 },
      hong_kong:       { valorReal:  9000, tempoMinimo: 2 },
      turquia:         { valorReal: 11000, tempoMinimo: 3 },
      reino_unido:     { valorReal: 15000, tempoMinimo: 3 },
      inglaterra:      { valorReal: 15000, tempoMinimo: 3 },
      tailandia:       { valorReal: 11000, tempoMinimo: 3 },
      alemanha:        { valorReal:  9000, tempoMinimo: 2 },
      macau:           { valorReal:  9000, tempoMinimo: 2 },
      malasia:         { valorReal:  8000, tempoMinimo: 2 },
      grecia:          { valorReal: 13000, tempoMinimo: 3 },
      dinamarca:       { valorReal: 13000, tempoMinimo: 3 },
      canada:          { valorReal: 10000, tempoMinimo: 2 },
      austria:         { valorReal: 12000, tempoMinimo: 3 },
    },

    // ---- JOGOS ----
    jogos: {
      playstation4:    { valorReal:  1500, tempoMinimo: 1 },
      playstation5:    { valorReal:  4500, tempoMinimo: 1 },
      xbox_series_s:   { valorReal:  2500, tempoMinimo: 1 },
      xbox_series_x:   { valorReal:  3500, tempoMinimo: 1 },
      nintendo_switch: { valorReal:  2800, tempoMinimo: 1 },
      pc_gamer_top:    { valorReal: 12000, tempoMinimo: 3 },
      minecraft:       { valorReal:   120, tempoMinimo: 1 },
      gta6:            { valorReal:   300, tempoMinimo: 1 },
      cadeira_gamer:   { valorReal:  1500, tempoMinimo: 1 },
      monitor_gamer:   { valorReal:  2500, tempoMinimo: 1 },
    },
  };

  // ==========================================================
  //  DESAFIOS — sem preço, só esforço/tempo humano estimado
  //  mesesBase = tempo médio realista em meses para alcançar
  // ==========================================================
  const DESAFIOS = {
    desafiosFinanceiros: {
      "100000":     { mesesBase:  24 },
      "500000":     { mesesBase:  60 },
      "1000000":    { mesesBase:  96 },
      "10000000":   { mesesBase: 180 },
      "100000000":  { mesesBase: 300 },
      estavel:      { mesesBase:  18 },
      estabilidade: { mesesBase:  24 },
      rico:         { mesesBase:  96 },
      milionario:   { mesesBase:  96 },
      bilionario:   { mesesBase: 360 },
    },
    desafiosAmorosos: {
      namorada:          { mesesBase:  8 },
      namorado:          { mesesBase:  8 },
      casar:             { mesesBase: 36 },
      familia:           { mesesBase: 48 },
      transar:           { mesesBase:  4 },
      perder_virgindade: { mesesBase:  6 },
      sexo:              { mesesBase:  4 },
    },
    desafiosMusicais: {
      violao:       { mesesBase: 12 },
      guitarra:     { mesesBase: 18 },
      teclado:      { mesesBase: 15 },
      piano:        { mesesBase: 24 },
      flauta:       { mesesBase: 12 },
      bateria:      { mesesBase: 12 },
      baixo:        { mesesBase: 12 },
      contrabaixo:  { mesesBase: 12 },
      saxofone:     { mesesBase: 24 },
      violino:      { mesesBase: 48 },
      ukulele:      { mesesBase:  8 },
      harpa:        { mesesBase: 30 },
      gaita:        { mesesBase:  8 },
      violoncelo:   { mesesBase: 36 },
      pandeiro:     { mesesBase:  6 },
      trompete:     { mesesBase: 24 },
    },
    fama: {
      famoso:              { mesesBase:  60 },
      celebridade:         { mesesBase:  72 },
      influencer:          { mesesBase:  24 },
      streamer:            { mesesBase:  18 },
      youtuber:            { mesesBase:  18 },
      tiktoker:            { mesesBase:  12 },
      criador_conteudo:    { mesesBase:  18 },
      cantor:              { mesesBase:  48 },
      musico:              { mesesBase:  36 },
      rapper:              { mesesBase:  30 },
      dj:                  { mesesBase:  24 },
      produtor_musical:    { mesesBase:  36 },
      compositor:          { mesesBase:  30 },
      banda:               { mesesBase:  36 },
      ator:                { mesesBase:  60 },
      atriz:               { mesesBase:  60 },
      dublador:            { mesesBase:  24 },
      apresentador:        { mesesBase:  30 },
      gamer_profissional:  { mesesBase:  48 },
      jogador_esports:     { mesesBase:  48 },
      modelo:              { mesesBase:  36 },
      influencer_fitness:  { mesesBase:  18 },
      influencer_moda:     { mesesBase:  18 },
      viralizar:           { mesesBase:   6 },
      viralizar_video:     { mesesBase:   6 },
      ganhar_seguidores:   { mesesBase:   9 },
      "100k_seguidores":   { mesesBase:  18 },
      "1m_seguidores":     { mesesBase:  48 },
      "10m_seguidores":    { mesesBase: 120 },
    },
    profissao: {
      medico:        { mesesBase:  84 },   // ~7 anos
      engenheiro:    { mesesBase:  60 },
      veterinario:   { mesesBase:  60 },
      cientista:     { mesesBase:  72 },
      administrador: { mesesBase:  48 },
      desenvolvedor: { mesesBase:  24 },
      programador:   { mesesBase:  18 },
      arquiteto:     { mesesBase:  60 },
      nutricionista: { mesesBase:  48 },
      psicologo:     { mesesBase:  60 },
      juiz:          { mesesBase: 120 },
      economista:    { mesesBase:  60 },
      enfermeiro:    { mesesBase:  48 },
      atleta:        { mesesBase:  60 },
      bombeiro:      { mesesBase:  24 },
      farmaceutico:  { mesesBase:  54 },
      professor:     { mesesBase:  48 },
      advogado:      { mesesBase:  60 },
      contador:      { mesesBase:  48 },
      piloto:        { mesesBase:  36 },
    },
  };

  // ---------- NORMALIZAÇÃO ----------
  const STOP_WORDS = new Set([
    'comprar','quero','queria','viajar','para','um','uma','uns','umas',
    'o','a','os','as','meu','minha','ter','ser','virar','me','tornar',
    'aprender','tocar','preciso','sonho','com','novo','nova'
  ]);

  function norm(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  }

  // ---------- BUSCA ----------
  function buscar(texto) {
    const n = norm(texto);
    const palavras = n.split(/\s+/).filter(p => !STOP_WORDS.has(p));
    const candidatos = [];

    // Busca em COMPRAS
    for (const categoria in COMPRAS) {
      for (const chave in COMPRAS[categoria]) {
        const chaveNorm = norm(chave.replace(/_/g,' '));
        const dados = COMPRAS[categoria][chave];
        const tipo = 'compra';

        if (n === chaveNorm) return { categoria, chave, dados, tipo };
        if (n.includes(chaveNorm) || chaveNorm.includes(n)) {
          candidatos.push({ categoria, chave, dados, tipo, score: 100 + chaveNorm.length });
          continue;
        }
        const chavePalavras = chaveNorm.split(/\s+/);
        const matches = chavePalavras.filter(cp =>
          palavras.some(p => p === cp || p.includes(cp) || cp.includes(p))
        );
        if (matches.length > 0 && matches.length >= chavePalavras.length * 0.8) {
          candidatos.push({ categoria, chave, dados, tipo, score: matches.length * 10 + chaveNorm.length });
        }
      }
    }

    // Busca em DESAFIOS
    for (const categoria in DESAFIOS) {
      for (const chave in DESAFIOS[categoria]) {
        const chaveNorm = norm(chave.replace(/_/g,' '));
        const dados = DESAFIOS[categoria][chave];
        const tipo = 'desafio';

        if (n === chaveNorm) return { categoria, chave, dados, tipo };
        if (n.includes(chaveNorm) || chaveNorm.includes(n)) {
          candidatos.push({ categoria, chave, dados, tipo, score: 100 + chaveNorm.length });
          continue;
        }
        const chavePalavras = chaveNorm.split(/\s+/);
        const matches = chavePalavras.filter(cp =>
          palavras.some(p => p === cp || p.includes(cp) || cp.includes(p))
        );
        if (matches.length > 0 && matches.length >= chavePalavras.length * 0.8) {
          candidatos.push({ categoria, chave, dados, tipo, score: matches.length * 10 + chaveNorm.length });
        }
      }
    }

    if (!candidatos.length) return null;
    candidatos.sort((a, b) => b.score - a.score);
    return candidatos[0];
  }

  // ---------- CÁLCULO CENTRAL ----------
  // Para COMPRAS:
  //   tempo = valorReal / poupancaMensal
  //   aplicado floor (tempoMinimo) para credibilidade
  //
  // Para DESAFIOS:
  //   tempo = mesesBase (não depende de dinheiro — é esforço humano)
  //
  function calcularTempo(found, poupancaMensal) {
    if (found.tipo === 'compra') {
      const { valorReal, tempoMinimo } = found.dados;
      const raw = valorReal / poupancaMensal;            // fórmula linear, justificável
      return Math.max(tempoMinimo, raw);                 // floor de credibilidade
    } else {
      return found.dados.mesesBase;                      // puramente esforço humano
    }
  }

  // ---------- ERROS ----------
  const EXEMPLOS = ['celta','iphone15','casar','violao','medico','playstation5','macbook','ferrari'];

  function mostrarErro(titulo, msg, mostrarExemplos = false) {
    document.getElementById("resultado").innerHTML = '';
    document.getElementById("erro").innerHTML = `
      <div class="erro-container">
        <div class="erro-icon"></div>
        <div>
          <div class="erro-titulo">${titulo}</div>
          <div class="erro-msg">${msg}</div>
          ${mostrarExemplos ? `
            <div class="erro-exemplos">
              ${EXEMPLOS.map(e => `<span class="exemplo-tag" onclick="usarExemplo('${e}')">${e}</span>`).join('')}
            </div>` : ''}
        </div>
      </div>
    `;
  }

  window.usarExemplo = function(valor) {
    document.getElementById("objetivo").value = valor;
    document.getElementById("erro").innerHTML = '';
    Estimar();
  };

  // ---------- ESTIMAR ----------
  function Estimar() {
    document.getElementById("erro").innerHTML = '';
    document.getElementById("resultado").innerHTML = '';

    const textoObj = document.getElementById("objetivo").value.trim();
    if (!textoObj) {
      mostrarErro("Campo vazio", "Digite um objetivo para calcular.", false);
      return;
    }

    const found = buscar(textoObj);
    if (!found) {
      mostrarErro("Objetivo não encontrado", "Não reconhecemos esse item ainda. Tente um desses:", true);
      return;
    }

    const ehCompra = found.tipo === 'compra';

    // Poupança mensal — obrigatória apenas para compras
    let poupancaMensal = parseFloat(document.getElementById("poupancaMensal").value);
    if (ehCompra) {
      if (isNaN(poupancaMensal) || poupancaMensal <= 0) {
        mostrarErro("Poupança não informada", "Para calcular o tempo de compra, informe quanto consegue guardar por mês.", false);
        return;
      }
    }

    const tempo = calcularTempo(found, poupancaMensal);
    const { chave, dados } = found;
    const nomeExibido = chave.replace(/_/g, ' ');

    // Dados financeiros (só compras)
    const valorReal       = ehCompra ? dados.valorReal : null;
    const tempoCalcRaw    = ehCompra ? dados.valorReal / poupancaMensal : null;
    const usouFloor       = ehCompra && tempo > tempoCalcRaw;

    // Histórico local para progresso
    const historico = JSON.parse(localStorage.getItem("objetivos_historico") || "[]");
    const objSalvo  = historico.find(i => norm(i.nome) === norm(nomeExibido));
    const valorPoupado  = objSalvo ? (objSalvo.valorPoupado || 0) : 0;
    const dataCriacao   = objSalvo ? (objSalvo.dataCriacao || objSalvo.data) : new Date().toISOString();

    // Progresso por tempo decorrido
    let pctData = 0;
    if (dataCriacao && tempo) {
      const inicio  = new Date(dataCriacao).getTime();
      const agora   = Date.now();
      const totalMs = tempo * 30.44 * 24 * 3600 * 1000;
      pctData = Math.min(100, Math.round(((agora - inicio) / totalMs) * 100));
    }
    // Progresso por valor poupado
    let pctValor = (valorReal && valorPoupado) ? Math.min(100, Math.round((valorPoupado / valorReal) * 100)) : 0;
    const pctFinal = Math.max(pctData, pctValor);

    // Bloco de atualização manual
    const blocoAtualizar = ehCompra ? `
      <div class="atualizar-wrapper">
        <div class="atualizar-label"> Quanto você já guardou?</div>
        <div class="atualizar-row">
          <input type="number" class="atualizar-input" id="input-poupado"
            placeholder="Ex: 500" min="0" step="0.01"
            value="${valorPoupado > 0 ? valorPoupado : ''}">
          <button class="atualizar-btn" onclick="atualizarPoupado()">Atualizar</button>
        </div>
      </div>` : '';

    // Bloco de progresso
    const blocoProgresso = `
      <div class="progresso-wrapper">
        <div class="progresso-header">
          <span class="progresso-label">Progresso atual</span>
          <span class="progresso-percent" id="pct-valor">0%</span>
        </div>
        <div class="progresso-track">
          <div class="progresso-fill" id="progress-fill" style="width:0%"></div>
        </div>
        <div class="progresso-detalhes">
          ${pctData  > 0 ? `<span class="detalhe-badge"> Por tempo: ${pctData}%</span>` : ''}
          ${pctValor > 0 ? `<span class="detalhe-badge"> Por valor: ${pctValor}%</span>` : ''}
        </div>

        ${ehCompra ? `
        <div class="meta-row">
          <div class="meta-col">
            <span class="meta-col-label">Preço real</span>
            <span class="meta-col-valor accent">R$ ${valorReal.toLocaleString('pt-BR')}</span>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-col">
            <span class="meta-col-label">Poupança/mês</span>
            <span class="meta-col-valor">R$ ${poupancaMensal.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-col">
            <span class="meta-col-label">Conclusão</span>
            <span class="meta-col-valor">${tempo.toFixed(1)} meses</span>
          </div>
        </div>
        ${blocoAtualizar}
        ` : `
        <div class="meta-row">
          <div class="meta-col">
            <span class="meta-col-label">Categoria</span>
            <span class="meta-col-valor accent">${found.categoria.replace(/([A-Z])/g, ' $1').trim()}</span>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-col">
            <span class="meta-col-label">Prazo estimado</span>
            <span class="meta-col-valor">${tempo.toFixed(0)} meses</span>
          </div>
        </div>`}
      </div>
    `;

    document.getElementById("resultado").innerHTML = `
      <div class="item-nome">${escapeHtml(nomeExibido)}</div>
      <div class="label">tempo estimado</div>
      <div class="tempo">${tempo.toFixed(1)}</div>
      <div class="unidade">meses</div>
      ${blocoProgresso}
    `;

    // Anima barra
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const fill  = document.getElementById('progress-fill');
        const pctEl = document.getElementById('pct-valor');
        if (fill)  fill.style.width = pctFinal + '%';
        if (pctEl) pctEl.textContent = pctFinal + '%';
      });
    });

    // Referências globais para atualizar poupado
    window._objAtualNome  = nomeExibido;
    window._objAtualMeta  = valorReal;
    window._objAtualTempo = tempo.toFixed(1);
    window._objAtualId    = objSalvo ? objSalvo.id : null;

    storage.salvarObjetivo(nomeExibido, tempo.toFixed(1), valorReal);
  }

  // ---------- ATUALIZAR POUPADO ----------
  window.atualizarPoupado = function() {
    const inputEl = document.getElementById('input-poupado');
    if (!inputEl) return;
    const valor = parseFloat(inputEl.value);
    if (isNaN(valor) || valor < 0) return;

    const historico = JSON.parse(localStorage.getItem("objetivos_historico") || "[]");
    const item = historico.find(i => norm(i.nome) === norm(window._objAtualNome || ''));
    if (item) storage.atualizarPoupado(item.id, valor);

    const meta = window._objAtualMeta;
    if (meta) {
      const pctValorNovo = Math.min(100, Math.round((valor / meta) * 100));
      const fill    = document.getElementById('progress-fill');
      const pctEl   = document.getElementById('pct-valor');
      const detalhes= document.querySelector('.progresso-detalhes');
      if (fill)    fill.style.width = pctValorNovo + '%';
      if (pctEl)   pctEl.textContent = pctValorNovo + '%';
      if (detalhes) detalhes.innerHTML = pctValorNovo > 0
        ? `<span class="detalhe-badge"> Por valor: ${pctValorNovo}%</span>` : '';
    }
  };

  // ---------- STORAGE ----------
  const storage = {
    async salvarObjetivo(nome, tempo, metaValor) {
      const dados = {
        nome, tempo: parseFloat(tempo),
        data: new Date().toISOString(),
        dataCriacao: new Date().toISOString(),
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
        metaValor: metaValor || null,
        valorPoupado: 0
      };
      if (useFirebase && auth && auth.currentUser) {
        try {
          await db.collection("objetivos").add({
            uid: auth.currentUser.uid, nome, tempo, data: new Date()
          });
        } catch(e) {
          console.warn("Erro Firebase, salvando local", e);
          this._salvarLocal(dados);
        }
      } else {
        this._salvarLocal(dados);
      }
      await this.carregarObjetivos();
    },

    _salvarLocal(dados) {
      const lista = JSON.parse(localStorage.getItem("objetivos_historico") || "[]");
      lista.unshift(dados);
      if (lista.length > 10) lista.pop();
      localStorage.setItem("objetivos_historico", JSON.stringify(lista));
    },

    atualizarPoupado(id, valorPoupado) {
      const lista = JSON.parse(localStorage.getItem("objetivos_historico") || "[]");
      const item  = lista.find(i => i.id === id);
      if (item) {
        item.valorPoupado = valorPoupado;
        localStorage.setItem("objetivos_historico", JSON.stringify(lista));
      }
      this.carregarObjetivos();
    },

    async excluirObjetivo(id, isFirebaseId = false) {
      if (useFirebase && auth && auth.currentUser && isFirebaseId) {
        try { await db.collection("objetivos").doc(id).delete(); }
        catch(e) { console.error("Erro ao excluir do Firebase", e); }
      } else {
        const lista = JSON.parse(localStorage.getItem("objetivos_historico") || "[]").filter(i => i.id !== id);
        localStorage.setItem("objetivos_historico", JSON.stringify(lista));
      }
      await this.carregarObjetivos();
    },

    async carregarObjetivos() {
      let objetivos = [];
      if (useFirebase && auth && auth.currentUser) {
        try {
          const snapshot = await db.collection("objetivos")
            .where("uid","==",auth.currentUser.uid)
            .orderBy("data","desc").limit(10).get();
          snapshot.forEach(doc => {
            const obj = doc.data();
            objetivos.push({ id: doc.id, nome: obj.nome, tempo: obj.tempo, isFirebase: true });
          });
        } catch(e) {
          console.warn("Erro Firebase, usando localStorage", e);
          objetivos = this._carregarLocal();
        }
      } else {
        objetivos = this._carregarLocal();
      }
      this._renderizarLista(objetivos);
    },

    _carregarLocal() {
      return JSON.parse(localStorage.getItem("objetivos_historico") || "[]").map(item => ({
        id: item.id, nome: item.nome, tempo: item.tempo,
        metaValor: item.metaValor || null,
        valorPoupado: item.valorPoupado || 0,
        dataCriacao: item.dataCriacao || item.data || null,
        isFirebase: false
      }));
    },

    _renderizarLista(objetivos) {
      const container = document.getElementById("listaObjetivos");
      if (!container) return;
      if (!objetivos.length) { container.innerHTML = ""; return; }

      let html = "<h3>⏳ Seus últimos objetivos</h3>";
      objetivos.forEach(obj => {
        let pctData = 0;
        if (obj.dataCriacao && obj.tempo) {
          const inicio  = new Date(obj.dataCriacao).getTime();
          const agora   = Date.now();
          const totalMs = parseFloat(obj.tempo) * 30.44 * 24 * 3600 * 1000;
          pctData = Math.min(100, Math.round(((agora - inicio) / totalMs) * 100));
        }
        let pctValor = 0;
        if (obj.metaValor && obj.valorPoupado) {
          pctValor = Math.min(100, Math.round((obj.valorPoupado / obj.metaValor) * 100));
        }
        const pctFinal = Math.max(pctData, pctValor);

        html += `
          <div class="objetivo-item" data-id="${obj.id}" data-firebase="${obj.isFirebase}">
            <div style="flex:1;min-width:0">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
                <strong>${escapeHtml(obj.nome)}</strong>
                <span style="font-size:0.78rem;color:var(--accent);font-weight:700;margin-left:8px;white-space:nowrap">${pctFinal}%</span>
              </div>
              <div style="height:4px;background:rgba(255,255,255,0.06);border-radius:100px;overflow:hidden">
                <div style="height:100%;width:${pctFinal}%;background:linear-gradient(90deg,var(--accent),var(--accent-2));border-radius:100px;transition:width 0.8s ease"></div>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:4px">
                <span style="font-size:0.7rem;color:var(--text-muted)">⏱ ${obj.tempo} meses</span>
                ${obj.metaValor ? `<span style="font-size:0.7rem;color:var(--text-muted)">💰 R$ ${Number(obj.valorPoupado||0).toLocaleString('pt-BR')} / R$ ${Number(obj.metaValor).toLocaleString('pt-BR')}</span>` : ''}
              </div>
            </div>
            <button class="delete-btn" data-id="${obj.id}" data-firebase="${obj.isFirebase}" style="margin-left:10px">🗑️</button>
          </div>
        `;
      });
      container.innerHTML = html;
    }
  };

  // ---------- INIT ----------
  document.addEventListener("DOMContentLoaded", () => {
    storage.carregarObjetivos();

    document.getElementById("objetivo").addEventListener("keypress", e => {
      if (e.key === "Enter") Estimar();
    });
    document.getElementById("poupancaMensal").addEventListener("keypress", e => {
      if (e.key === "Enter") Estimar();
    });

    document.getElementById("listaObjetivos").addEventListener("click", async e => {
      const btn = e.target.closest(".delete-btn");
      if (!btn) return;
      e.preventDefault();
      const id = btn.getAttribute("data-id");
      const isFirebase = btn.getAttribute("data-firebase") === "true";
      if (id) await storage.excluirObjetivo(id, isFirebase);
    });
  });