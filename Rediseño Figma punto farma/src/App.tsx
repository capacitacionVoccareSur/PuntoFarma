import { useState, useEffect } from "react"
import type { ReactNode } from "react"

/* ── DATA ─────────────────────────────────────────────── */
const specialties = [
  { name: "Medicina General",  desc: "Consultas generales, diagnóstico y tratamiento",      min: 70000,  max: 80000  },
  { name: "Pediatría",         desc: "Atención médica para niños y adolescentes",            min: 70000,  max: 80000  },
  { name: "Nutrición",         desc: "Evaluación y planes nutricionales personalizados",     min: 70000,  max: 70000  },
  { name: "Oftalmología",      desc: "Salud visual y enfermedades oculares",                 min: 70000,  max: 70000  },
  { name: "Ginecología",       desc: "Salud femenina y sistema reproductivo",                min: 80000,  max: 100000 },
  { name: "Gastroenterología", desc: "Enfermedades del sistema digestivo",                   min: 100000, max: 100000 },
  { name: "Cardiología",       desc: "Corazón y sistema circulatorio",                       min: 100000, max: 100000 },
  { name: "Geriatría",         desc: "Atención especializada para adultos mayores",          min: 100000, max: 100000 },
  { name: "Urología",          desc: "Sistema urinario y renal",                             min: 100000, max: 120000 },
  { name: "Traumatología",     desc: "Lesiones musculoesqueléticas y ortopedia",             min: 100000, max: 130000 },
  { name: "Psicología",        desc: "Salud mental y bienestar emocional",                   min: 70000,  max: 130000 },
]

const questions = [
  "¿Nombre completo?",
  "¿Teléfono (con 09...)?",
  "¿Edad?",
  "¿Sexo?",
  "¿Motivo de consulta?",
  "¿Especialidad?",
  "¿Correo electrónico?",
]

const reminders: ReactNode[] = [
  <span>Teléfono siempre con prefijo <strong>09...</strong></span>,
  <span>Expediente con dirección <strong>Central / Asunción</strong></span>,
  <span>Entidades <strong>1 y 2</strong> al crear el expediente</span>,
  <span>Si no valida en SOA: <strong>crear manual y escalar</strong></span>,
  <span>Solo se atiende al <strong>titular del programa</strong> <em>(En caso de solicitud de pediatría escalar a filial)</em></span>,
]

/* ── UTILS ────────────────────────────────────────────── */
const fmt = new Intl.NumberFormat("es-PY")
const cost = (s: { min: number; max: number }) =>
  s.min === s.max ? fmt.format(s.min) : `${fmt.format(s.min)}–${fmt.format(s.max)}`


/* ── ICONS ────────────────────────────────────────────── */
type IconName = "arrow" | "external" | "info" | "chevron" | "close"

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow:    <path d="M4 12h15m-6-6 6 6-6 6" />,
    chevron:  <path d="m6 9 6 6 6-6" />,
    close:    <path d="M18 6 6 18M6 6l12 12" />,
    external: <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />,
    info:     <><circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v.1" /></>,
  }
  return (
    <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.65" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

/* ── STEP MEDIA ───────────────────────────────────────── */
/* Coloca las capturas en public/capturas/ con los nombres indicados en src.
   Mientras no exista el archivo, muestra el placeholder con borde punteado. */
function StepMedia({ src, alt }: { src: string; alt: string }) {
  const resolvedSrc = import.meta.env.BASE_URL + src.replace(/^\//, '')
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)
  return (
    <div className={`modal-media-slot${loaded ? " media-loaded" : ""}`}>
      {!error && (
        <img
          src={resolvedSrc} alt={alt}
          className="modal-media-img"
          style={{ display: loaded ? "block" : "none" }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      {!loaded && <span className="modal-media-text">Imagen / Video del paso</span>}
    </div>
  )
}

/* ── APP ──────────────────────────────────────────────── */
export default function App() {
  const [especOpen,     setEspecOpen]     = useState(false)
  const [progOpen,      setProgOpen]      = useState(false)
  const [asignModal,    setAsignModal]    = useState(false)
  const [medicaiaModal, setMedicaiaModal] = useState(false)

  useEffect(() => {
    document.documentElement.lang = "es"
    document.title = "Punto Farma · Panel de Gestión"
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setAsignModal(false); setMedicaiaModal(false) }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (asignModal || medicaiaModal) ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [asignModal, medicaiaModal])

  return (
    <div className="app-shell">

      {/* ── HEADER ─────────────────────────────────────── */}
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#" aria-label="Punto Farma">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Punto Farma" className="brand-logo" />
          </a>
          <div className="header-divider" />
          <span className="header-subtitle">Información importante para gestión diaria</span>
        </div>
      </header>

      {/* ── BENTO GRID ─────────────────────────────────── */}
      <main className="bento-grid">

        {/* ①  SPEECH ──────────────────────────────────── */}
        <article className="card card-speech">
          <div className="card-head">
            <div className="card-kicker">GUION · VALIDACIÓN · PREGUNTAS</div>
            <div className="card-title">Speech de Bienvenida</div>
          </div>

          <div className="speech-layout">
            {/* left: script + pasos */}
            <div className="speech-col-left">
              <section className="script-block" aria-label="Guion de bienvenida">
                <div className="script-topline">
                  <span className="script-label">GUION DE BIENVENIDA</span>
                </div>
                <div className="script-text">
                  <p>Buenos días / buenas tardes / buenas noches.</p>
                  <p>Le saluda __________ del Programa <strong>Punto Salud.</strong></p>
                  <span className="script-closing">¿Cómo le podemos ayudar?</span>
                </div>
                <span className="quote-decor" aria-hidden="true">"</span>
              </section>

              <section aria-labelledby="val-title">
                <h3 className="steps-title" id="val-title">Validación y registro</h3>
                <ol className="steps-list">
                  <li>
                    <span className="step-num">1</span>
                    <div className="step-body">
                      <h4>Solicitar cédula del paciente</h4>
                      <p>Atención únicamente al titular.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">2</span>
                    <div className="step-body">
                      <h4>Validar en SOA</h4>
                      <p>Si no valida: crear manualmente y escalar.</p>
                    </div>
                  </li>
                  <li>
                    <span className="step-num step-warn">!</span>
                    <div className="step-body">
                      <div className="notice-inline">
                        <Icon name="info" />
                        <p>
                          Crear expediente con dirección{" "}
                          <strong>Central / Asunción</strong> en entidades{" "}
                          <strong>1 y 2.</strong>
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <span className="step-num">3</span>
                    <div className="step-body">
                      <h4>Confirmar teléfono</h4>
                      <p>Siempre con el prefijo <strong>09…</strong></p>
                    </div>
                  </li>
                </ol>
              </section>
            </div>

            {/* right: preguntas + recordatorios */}
            <div className="questions-col" aria-labelledby="q-title">
              <div className="questions-header">
                <h3 id="q-title">Preguntas obligatorias</h3>
                <span className="questions-count">7 datos</span>
              </div>
              <ul className="questions-list">
                {questions.map((q, i) => (
                  <li key={q}>
                    <span className="q-num">{String(i + 1)}</span>
                    {q}
                  </li>
                ))}
              </ul>

              <div className="q-rem-divider" />
              <p className="q-rem-label">Recordatorios</p>
              <ul className="q-rem-list">
                {reminders.map((r, i) => (
                  <li key={i} className="q-rem-item">
                    <span className="rem-dot" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* ── COLUMNA DERECHA ─────────────────────────── */}
        <div className="right-col">

        {/* ②  ESPECIALIDADES ──────────────────────────── */}
        <article className={`card card-espec ${especOpen ? "espec-expanded" : ""}`}>
          <button
            className="espec-toggle"
            type="button"
            aria-expanded={especOpen}
            onClick={() => setEspecOpen(v => !v)}
          >
            <div>
              <div className="card-kicker">COBERTURAS</div>
              <div className="card-title">Especialidades y costos</div>
            </div>
            <Icon name="chevron" className="espec-toggle-chevron" />
          </button>

          <div className="espec-body">
            <div className="espec-body-inner">
              <ul className="spec-list" role="list">
                {specialties.map(s => (
                  <li key={s.name} className="spec-row">
                    <div className="spec-row-left">
                      <span className="spec-row-name">{s.name}</span>
                      <span className="spec-row-desc">{s.desc}</span>
                    </div>
                    <span className="spec-row-cost">{cost(s)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* ③  PROGRAMAS ───────────────────────────────── */}
        <article className={`card card-prog ${progOpen ? "prog-expanded" : ""}`}>
          <button
            className="prog-toggle"
            type="button"
            aria-expanded={progOpen}
            onClick={() => setProgOpen(v => !v)}
          >
            <div>
              <div className="card-kicker">PLANES DE COBERTURA</div>
              <div className="card-title">Programas</div>
            </div>
            <Icon name="chevron" className="prog-toggle-chevron" />
          </button>

          <div className="prog-body">
            <div className="prog-body-inner">
              <div className="prog-plans">
                <div className="prog-plan prog-base">
                  <div className="prog-tag">Estándar</div>
                  <div className="prog-name">Programa Base</div>
                  <ul className="prog-features">
                    <li>Med. General + Especialistas</li>
                    <li>Segunda Opinión Médica</li>
                    <li>Orientación Tel. + Recordatorios</li>
                    <li>Coordinación de Citas</li>
                  </ul>
                </div>
                <div className="prog-plan prog-full">
                  <div className="prog-tag">Premium</div>
                  <div className="prog-name">Programa Full</div>
                  <ul className="prog-features">
                    <li>Todo lo del Base</li>
                    <li>+ Nutrición Crónicas</li>
                    <li>+ Nutrición Infantil</li>
                    <li>+ Nutrición / Peso</li>
                  </ul>
                </div>
              </div>
              <div className="prog-diff">
                <Icon name="info" />
                <span>La diferencia clave del <strong>Full</strong> son los 3 servicios de Nutrición.</span>
              </div>
              <a
                href="http://192.168.20.242/index.php/servicios/paises/multi-pais-1/2014-12-10-13-23-45/a-condicionados-py"
                target="_blank"
                rel="noopener noreferrer"
                className="prog-link"
              >
                Ver condicionado del programa <Icon name="external" />
              </a>
            </div>
          </div>
        </article>

        {/* ④  ASIGNAR SERVICIOS ────────────────────── */}
        <article className="card card-asign">
          <button className="proc-toggle" type="button" onClick={() => setAsignModal(true)}>
            <div>
              <div className="card-kicker">PROCEDIMIENTO</div>
              <div className="card-title">¿Cómo asignar servicios en SOA?</div>
            </div>
            <Icon name="arrow" className="proc-arrow" />
          </button>
        </article>

        {/* ⑤  ASIGNAR DESDE MEDICAIA ───────────────── */}
        <article className="card card-medicaia">
          <button className="proc-toggle" type="button" onClick={() => setMedicaiaModal(true)}>
            <div>
              <div className="card-kicker">PROCEDIMIENTO</div>
              <div className="card-title">¿Cómo asignar desde Medicaia? (En caso de que no funcione el SOA)</div>
            </div>
            <Icon name="arrow" className="proc-arrow" />
          </button>
        </article>

        {/* ⑥  LINKS ───────────────────────────────────── */}
        <article className="card card-links">
          <div className="card-head">
            <div className="card-kicker">ACCESOS RÁPIDOS</div>
            <div className="card-title">Links del programa</div>
          </div>

          <nav className="links-list" aria-label="Accesos rápidos">
            <a
              href="https://puntofarma.medicaia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-item"
            >
              Plataforma Medicaia.com
              <Icon name="external" />
            </a>
            <a
              href="https://script.google.com/a/macros/voccare.global/s/AKfycbxwC1FTajfuA0ExsU5SCkbatU9yHzELzZ4nO4WG1rpX93FlM_EUiTHKGrCU3v10mtri/exec"
              target="_blank"
              rel="noopener noreferrer"
              className="link-item"
            >
              Página de costos y horarios de médicos
              <Icon name="external" />
            </a>
          </nav>
        </article>

        </div>{/* /right-col */}

      </main>

      {/* ── MODAL: ASIGNAR SERVICIOS ──────────────────── */}
      <div
        className={`modal-overlay${asignModal ? " modal-open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setAsignModal(false) }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-asign-title"
      >
        <div className="modal-panel">
          <div className="modal-header">
            <div>
              <div className="modal-kicker">PROCEDIMIENTO PASO A PASO</div>
              <h2 className="modal-title" id="modal-asign-title">¿Cómo asignar servicios en SOA?</h2>
            </div>
            <button className="modal-close" type="button" onClick={() => setAsignModal(false)} aria-label="Cerrar">
              <Icon name="close" />
            </button>
          </div>

          <div className="modal-body">

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">1</span>
                <div>
                  <h3 className="modal-step-title">Verificar datos del expediente</h3>
                  <p className="modal-step-desc">Confirmar que el <strong>mail del afiliado</strong> esté cargado, que la dirección figure como <strong>Central / Asunción</strong> y que el servicio esté registrado como <strong>Programado</strong>.</p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/1.png" alt="Expediente con mail, dirección y servicio programado" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">2</span>
                <div>
                  <h3 className="modal-step-title">Consultar disponibilidades</h3>
                  <p className="modal-step-desc">Verificar en la <a href="https://script.google.com/a/macros/voccare.global/s/AKfycbxwC1FTajfuA0ExsU5SCkbatU9yHzELzZ4nO4WG1rpX93FlM_EUiTHKGrCU3v10mtri/exec" target="_blank" rel="noopener noreferrer" className="modal-link">página de disponibilidades y pagos</a> que aparezca el médico recomendado y reconfirmar sus horarios disponibles.</p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/2.png" alt="Disponibilidades del médico recomendado" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">3</span>
                <div>
                  <h3 className="modal-step-title">Revisar información del médico</h3>
                  <p className="modal-step-desc">Consultar la información completa del profesional. <strong>Comunicarse con el médico</strong> para confirmar la disponibilidad antes de proceder a la asignación.</p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/3.png" alt="Información completa del médico" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">4</span>
                <div>
                  <h3 className="modal-step-title">Asignar en SOA — desde la sugerencia</h3>
                  <p className="modal-step-desc">Una vez confirmada la disponibilidad, en SOA hacer clic en el <strong>botón de calendario</strong> que aparece junto al médico sugerido. <strong>No usar "Asignación Manual".</strong></p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/4.png" alt="Botón calendario en la sugerencia de médico" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">5</span>
                <div>
                  <h3 className="modal-step-title">O asignar desde búsqueda manual</h3>
                  <p className="modal-step-desc">Alternativamente, buscar al médico en SOA manualmente y hacer clic en el <strong>botón de calendario</strong> correspondiente.</p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/5.png" alt="Botón calendario en búsqueda manual" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">6</span>
                <div>
                  <h3 className="modal-step-title">Seleccionar día y hora</h3>
                  <p className="modal-step-desc">Identificar en el calendario el <strong>día y la hora</strong> ya acordada con el médico y el afiliado.</p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/6.png" alt="Selección de día y hora en el calendario" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">7</span>
                <div>
                  <h3 className="modal-step-title">Elegir el horario exacto</h3>
                  <p className="modal-step-desc">Al hacer clic en el día se abre la vista completa con fracciones de <strong>10 minutos</strong>. Desplazarse hacia abajo hasta encontrar la hora estipulada.</p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/7.png" alt="Vista de fracciones horarias de 10 minutos" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">8</span>
                <div>
                  <h3 className="modal-step-title">Reservar turno</h3>
                  <p className="modal-step-desc">Hacer clic en <strong>"Reservar turno"</strong>. La asignación se registra automáticamente en Medicaia y el afiliado recibe un mail para ingresar o registrarse. La fecha de programación se actualiza y se asigna el proveedor. <strong>10 minutos antes</strong> de la consulta le llega el link de la videollamada.</p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/8.png" alt="Confirmación de reserva de turno" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">9</span>
                <div>
                  <h3 className="modal-step-title">Monitoreo y satisfacción</h3>
                  <p className="modal-step-desc">Realizar seguimiento <strong>regular y manual</strong> del estado de la consulta y la satisfacción del afiliado.</p>
                </div>
              </div>
              <StepMedia src="/Asignación SOA/9.png" alt="Monitoreo y satisfacción post-consulta" />
            </div>

          </div>
        </div>
      </div>

      {/* ── MODAL: ASIGNAR DESDE MEDICAIA ──────────────── */}
      <div
        className={`modal-overlay${medicaiaModal ? " modal-open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setMedicaiaModal(false) }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-medicaia-title"
      >
        <div className="modal-panel">
          <div className="modal-header">
            <div>
              <div className="modal-kicker">PROCEDIMIENTO PASO A PASO</div>
              <h2 className="modal-title" id="modal-medicaia-title">¿Cómo asignar desde Medicaia? (En caso de que no funcione el SOA)</h2>
            </div>
            <button className="modal-close" type="button" onClick={() => setMedicaiaModal(false)} aria-label="Cerrar">
              <Icon name="close" />
            </button>
          </div>

          <div className="modal-body">

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">1</span>
                <div>
                  <h3 className="modal-step-title">Ingresar a la plataforma Medicaia</h3>
                  <p className="modal-step-desc">Accedé a <strong>puntofarma.medicaia.com</strong> e iniciá sesión con tus credenciales de coordinador.</p>
                </div>
              </div>
              <StepMedia src="/Asignación Medicaia/1.png" alt="Inicio de sesión en Medicaia" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">2</span>
                <div>
                  <h3 className="modal-step-title">Buscar al paciente</h3>
                  <p className="modal-step-desc">Buscar al titular por <strong>número de documento</strong> o <strong>nombre</strong>.</p>
                </div>
              </div>
              <StepMedia src="/Asignación Medicaia/2.png" alt="Búsqueda del paciente por documento o nombre" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">3</span>
                <div>
                  <h3 className="modal-step-title">Seleccionar el afiliado</h3>
                  <p className="modal-step-desc">Hacer clic en el <strong>botón de selección</strong> para ingresar al perfil del afiliado correspondiente.</p>
                </div>
              </div>
              <StepMedia src="/Asignación Medicaia/3.png" alt="Selección del afiliado" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">4</span>
                <div>
                  <h3 className="modal-step-title">Completar los datos del turno</h3>
                  <p className="modal-step-desc">Seguir el paso a paso completando la <strong>especialidad</strong>, el <strong>nombre del médico</strong> consultado, y la <strong>fecha y hora</strong> ya coordinada.</p>
                </div>
              </div>
              <StepMedia src="/Asignación Medicaia/4.png" alt="Datos de especialidad, médico, fecha y hora" />
            </div>

            <div className="modal-step">
              <div className="modal-step-head">
                <span className="modal-step-num">5</span>
                <div>
                  <h3 className="modal-step-title">Revisar y confirmar el turno</h3>
                  <p className="modal-step-desc">Revisar toda la información y confirmar para agendar el turno correctamente. El afiliado recibirá un <strong>mail de registro e ingreso</strong>. El <strong>link de la cita</strong> le llegará <strong>10 minutos antes</strong> de la consulta.</p>
                </div>
              </div>
              <StepMedia src="/Asignación Medicaia/5.png" alt="Revisión y confirmación del turno" />
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
