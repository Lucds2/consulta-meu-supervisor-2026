import React, { useState } from "react";
import listaVoluntarios from "./voluntarios.json";
import "./App.css";
import logoImg from "./Logo.png";
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaHome } from "react-icons/fa";

function App() {
  const [dia, setDia] = useState("");
  const [horario, setHorario] = useState("");
  const [setor, setSetor] = useState("");
  const [buscando, setBuscando] = useState(false);

  const todasAsEscalas = listaVoluntarios.flatMap((v) => v.escalas);
  const ordemDias = { "Sexta Feira": 1, Sábado: 2, Domingo: 3 };
  const diasUnicos = [...new Set(todasAsEscalas.map((e) => e.dia))].sort(
    (a, b) => (ordemDias[a] || 99) - (ordemDias[b] || 99),
  );

  const handleFiltroChange = (tipo, valor) => {
    setBuscando(true);
    if (tipo === "dia") {
      setDia(valor);
      setHorario("");
      setSetor("");
    } else if (tipo === "horario") {
      setHorario(valor);
      setSetor("");
    } else if (tipo === "setor") {
      setSetor(valor);
    }
    setTimeout(() => setBuscando(false), 300);
  };

  const horariosDisponiveis = [
    ...new Set(
      todasAsEscalas.filter((e) => e.dia === dia).map((e) => e.horario),
    ),
  ].sort();
  const setoresDisponiveis = [
    ...new Set(
      todasAsEscalas
        .filter((e) => e.dia === dia && e.horario === horario)
        .map((e) => e.setor),
    ),
  ].sort();

  const listaResultados = listaVoluntarios.filter((v) =>
    v.escalas.some(
      (e) => e.dia === dia && e.horario === horario && e.setor === setor,
    ),
  );

  return (
    <div className="container">
      <header className="header">
        <img src={logoImg} alt="Logo" className="logo-app" />
        <h1>Escala dos Supervisores</h1>
      </header>

      <div className="search-section">
        <div className="select-name">
          <select
            className="select-field"
            value={dia}
            onChange={(e) => handleFiltroChange("dia", e.target.value)}
          >
            <option value="">Selecione o Dia</option>
            {diasUnicos.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            className="select-field"
            value={horario}
            onChange={(e) => handleFiltroChange("horario", e.target.value)}
            disabled={!dia}
          >
            <option value="">
              {dia ? "Selecione o Horário" : "Escolha o dia primeiro"}
            </option>
            {horariosDisponiveis.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <select
            className="select-field"
            value={setor}
            onChange={(e) => handleFiltroChange("setor", e.target.value)}
            disabled={!horario}
          >
            <option value="">
              {horario ? "Selecione o Setor" : "Escolha o horário primeiro"}
            </option>
            {setoresDisponiveis.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {(dia || horario || setor) && (
          <button
            className="btn-limpar"
            onClick={() => {
              setDia("");
              setHorario("");
              setSetor("");
            }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="resultado-container">
        {buscando ? (
          <p className="mensagem-vazio">⏳ Buscando designações...</p>
        ) : (
          listaResultados.map((item, index) => {
            const escala = item.escalas.find(
              (e) =>
                e.dia === dia && e.horario === horario && e.setor === setor,
            );
            return (
              <div key={index} className="card-designacao">
                <p>
                  <FaUser className="icon-card" />{" "}
                  <strong className="nome-destaque">{item.nome}</strong>
                </p>
                <p>
                  <FaHome className="icon-card" /> {item.congregacao}
                </p>
                <p>
                  <FaPhoneAlt className="icon-card" />
                  <a
                    href={`https://wa.me/55${item.celular.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-telefone"
                  >
                    {item.celular}
                  </a>
                </p>
                <p>
                  <FaMapMarkerAlt className="icon-card" />{" "}
                  {escala?.posicao || "Posição não informada"}
                </p>
              </div>
            );
          })
        )}
      </div>

      <footer
        className="footer"
        style={{ marginTop: "40px", textAlign: "center" }}
      >
        Congresso Internacional Curitiba 2026 <br />
        <br />
        Desenvolvido por{" "}
        <a
          href="https://wa.me/5541984000638"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#2E7D32",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          LS DEV - (41) 98400-0638 - Luciano
        </a>
      </footer>
    </div>
  );
}

export default App;
