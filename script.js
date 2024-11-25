// Selección de elementos
const seccionRegistro = document.getElementById('seccion-registro');
const formularioRegistro = document.getElementById('formulario-registro');
const seccionIngreso = document.getElementById('seccion-ingreso');
const formularioIngreso = document.getElementById('formulario-ingreso');
const panelOpciones = document.getElementById('panel-opciones');
const nombreUsuarioActivo = document.getElementById('nombre-usuario-activo');
const saldoActual = document.getElementById('saldo-actual');
const acciones = document.getElementById('acciones');

let usuarioActivo = sessionStorage.getItem('usuarioActivo'); // Trae el usuario de la sesión si existe

// Verificar si ya hay un usuario activo
if (usuarioActivo) {
    mostrarPanelOpciones(usuarioActivo);
}

// Función para registrar usuarios
formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombreUsuario = document.getElementById('nombre-usuario').value;
    const contrasena = document.getElementById('contrasena').value;

    if (!nombreUsuario || !contrasena) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

    if (usuarios[nombreUsuario]) {
        alert('Este nombre de usuario ya está registrado.');
        return;
    }

    usuarios[nombreUsuario] = {
        contrasena,
        saldo: 200000,
        movimientos: []
    };

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');

    formularioRegistro.reset();
    seccionRegistro.style.display = 'none';
    seccionIngreso.style.display = 'block';
});

// Función para iniciar sesión
formularioIngreso.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario-ingreso').value;
    const contrasena = document.getElementById('contrasena-ingreso').value;

    if (!usuario || !contrasena) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

    if (!usuarios[usuario] || usuarios[usuario].contrasena !== contrasena) {
        alert('Nombre de usuario o contraseña incorrectos.');
        return;
    }

    sessionStorage.setItem('usuarioActivo', usuario);
    usuarioActivo = usuario;
    mostrarPanelOpciones(usuarioActivo);
});

// Mostrar panel de opciones
function mostrarPanelOpciones(usuario) {
    seccionRegistro.style.display = 'none';
    seccionIngreso.style.display = 'none';
    panelOpciones.style.display = 'block';
    nombreUsuarioActivo.textContent = usuario;
    actualizarSaldo(usuario);
}

// Actualizar saldo en el panel
function actualizarSaldo(usuario) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
    saldoActual.textContent = usuarios[usuario].saldo;
}

// Ver Saldo
document.getElementById('ver-saldo').addEventListener('click', () => {
    acciones.style.display = 'block';
    acciones.textContent = `Tu saldo actual es: $${saldoActual.textContent}`;
});

// Transferir
document.getElementById('transferir').addEventListener('click', () => {
    const monto = parseFloat(prompt('¿Cuánto deseas transferir?'));
    const destinatario = prompt('¿A quién deseas transferir el dinero?');

    if (isNaN(monto) || monto <= 0) {
        alert('Por favor ingresa un monto válido.');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

    if (!usuarios[destinatario]) {
        alert('El usuario destinatario no existe.');
        return;
    }

    if (usuarios[usuarioActivo].saldo < monto) {
        alert('No tienes suficiente saldo para realizar esta transferencia.');
        return;
    }

    usuarios[usuarioActivo].saldo -= monto;
    usuarios[destinatario].saldo += monto;

    usuarios[usuarioActivo].movimientos.push(`Transferiste $${monto} a ${destinatario}.`);
    usuarios[destinatario].movimientos.push(`Recibiste $${monto} de ${usuarioActivo}.`);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    actualizarSaldo(usuarioActivo);
    alert('Transferencia realizada con éxito.');
});

// Consignar
document.getElementById('consignar').addEventListener('click', () => {
    const monto = parseFloat(prompt('¿Cuánto deseas consignar?'));

    if (isNaN(monto) || monto <= 0) {
        alert('Por favor ingresa un monto válido.');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
    usuarios[usuarioActivo].saldo += monto;
    usuarios[usuarioActivo].movimientos.push(`Consignaste $${monto}.`);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    actualizarSaldo(usuarioActivo);
    alert('Consignación realizada con éxito.');
});

// Retirar
document.getElementById('retirar').addEventListener('click', () => {
    const monto = parseFloat(prompt('¿Cuánto deseas retirar?'));

    if (isNaN(monto) || monto <= 0) {
        alert('Por favor ingresa un monto válido.');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

    if (usuarios[usuarioActivo].saldo < monto) {
        alert('No tienes suficiente saldo para retirar esta cantidad.');
        return;
    }

    usuarios[usuarioActivo].saldo -= monto;
    usuarios[usuarioActivo].movimientos.push(`Retiraste $${monto}.`);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    actualizarSaldo(usuarioActivo);
    alert('Retiro realizado con éxito.');
});

// Ver movimientos
document.getElementById('ver-movimientos').addEventListener('click', () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
    const movimientos = usuarios[usuarioActivo].movimientos;

    if (movimientos.length === 0) {
        acciones.innerHTML = '<p>No tienes movimientos registrados.</p>';
    } else {
        acciones.innerHTML = movimientos.slice(-5).map((mov, index) => `<p>${index + 1}. ${mov}</p>`).join('');
    }
});

// Cerrar sesión
document.getElementById('cerrar-sesion').addEventListener('click', () => {
    sessionStorage.removeItem('usuarioActivo');
    usuarioActivo = null;
    panelOpciones.style.display = 'none';
    seccionIngreso.style.display = 'block';
});

