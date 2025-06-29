document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('foroForm');
  const foroMensajes = document.getElementById('foroMensajes');

  function cargarMensajes() {
    const mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
    foroMensajes.innerHTML = '';
    mensajes.forEach((m, index) => {
      const div = document.createElement('div');
      div.className = 'mensaje';
      div.innerHTML = `
        <p class="autor">${m.autor} <span class="fecha">(${m.fecha})</span></p>
        <p>${m.texto}</p>
        <button onclick="borrarMensaje(${index})">🗑️ Borrar</button>
        <button onclick="mostrarRespuesta(${index})">💬 Responder</button>
        <div id="respuestas-${index}" class="respuestas">
          ${(m.respuestas || []).map((r, i) => `
            <div class="respuesta">
              <p class="autor">${r.autor} <span class="fecha">(${r.fecha})</span></p>
              <p>${r.texto}</p>
              <button onclick="borrarRespuesta(${index}, ${i})">🗑️ Borrar respuesta</button>
            </div>
          `).join('')}
        </div>
        <div class="respuesta-form" id="form-${index}" style="display:none;">
          <input type="text" id="autor-r-${index}" placeholder="Tu nombre">
          <textarea id="comentario-r-${index}" rows="2" placeholder="Tu respuesta..."></textarea>
          <button onclick="enviarRespuesta(${index})">Responder</button>
        </div>
      `;
      foroMensajes.appendChild(div);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const autor = document.getElementById('autor').value.trim();
    const comentario = document.getElementById('comentario').value.trim();
    if (!autor || !comentario) return;
    const mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
    mensajes.push({
      autor,
      texto: comentario,
      fecha: new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }),
      respuestas: []
    });
    localStorage.setItem('mensajes', JSON.stringify(mensajes));
    form.reset();
    cargarMensajes();
  });

  window.borrarMensaje = function(index) {
    const mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
    mensajes.splice(index, 1);
    localStorage.setItem('mensajes', JSON.stringify(mensajes));
    cargarMensajes();
  };

  window.mostrarRespuesta = function(index) {
    const form = document.getElementById(`form-${index}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  };

  window.enviarRespuesta = function(index) {
    const autor = document.getElementById(`autor-r-${index}`).value.trim();
    const texto = document.getElementById(`comentario-r-${index}`).value.trim();
    if (!autor || !texto) return;
    const mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
    const fecha = new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
    mensajes[index].respuestas = mensajes[index].respuestas || [];
    mensajes[index].respuestas.push({ autor, texto, fecha });
    localStorage.setItem('mensajes', JSON.stringify(mensajes));
    cargarMensajes();
  };

  window.borrarRespuesta = function(mIndex, rIndex) {
    const mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
    mensajes[mIndex].respuestas.splice(rIndex, 1);
    localStorage.setItem('mensajes', JSON.stringify(mensajes));
    cargarMensajes();
  };

  cargarMensajes();
});
