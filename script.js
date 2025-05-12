AOS.init();

// Usar localStorage para mantener el carrito entre páginas
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para guardar el carrito en localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Función para actualizar el contador del carrito en todas las páginas
function updateCartCount() {
  const cartCounts = document.querySelectorAll('.cart-count');
  cartCounts.forEach(count => {
    count.textContent = cart.length;
  });
}

function addToCart(product, price) {
  cart.push({ product, price });
  saveCart();
  updateCart();
  
  // Mostrar notificación
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      <i class="fas fa-check-circle me-2"></i>Producto agregado al carrito
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (cartItems) {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="cart-item-details">
          <h6 class="mb-0">${item.product}</h6>
          <small class="text-muted">$${item.price}</small>
        </div>
        <div class="cart-item-actions">
          <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      cartItems.appendChild(li);
      total += item.price;
    });
    
    if (cartTotal) {
      cartTotal.textContent = total;
    }
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function sendInstagramDM() {
  const name = document.getElementById('user-name').value.trim();
  const address = document.getElementById('user-address').value.trim();
  const phone = document.getElementById('user-phone').value.trim();
  const message = document.getElementById('order-message').value.trim();

  if (!name || !address || !phone) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  let orderMessage = 'Hola, quiero hacer el siguiente pedido en Sports Threat:\n\n';
  let total = 0;
  cart.forEach(item => {
    orderMessage += `- ${item.product}: $${item.price}\n`;
    total += item.price;
  });
  orderMessage += `\nTotal: $${total}`;
  orderMessage += `\n\nDatos de contacto:`;
  orderMessage += `\nNombre: ${name}`;
  orderMessage += `\nDirección/Ciudad: ${address}`;
  orderMessage += `\nTeléfono: ${phone}`;
  if (message) {
    orderMessage += `\n\nMensaje adicional:\n${message}`;
  }

  // Abrir WhatsApp con el mensaje
  const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(orderMessage)}`;
  window.open(whatsappUrl, '_blank');
}

function prepareInstagramMessage() {
  const name = document.getElementById('user-name').value.trim();
  const address = document.getElementById('user-address').value.trim();
  const phone = document.getElementById('user-phone').value.trim();
  const message = document.getElementById('order-message').value.trim();

  if (!name || !address || !phone) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  let orderMessage = 'Hola, quiero hacer el siguiente pedido en Sports Threat:\n\n';
  let total = 0;
  cart.forEach(item => {
    orderMessage += `- ${item.product}: $${item.price}\n`;
    total += item.price;
  });
  orderMessage += `\nTotal: $${total}`;
  orderMessage += `\n\nDatos de contacto:`;
  orderMessage += `\nNombre: ${name}`;
  orderMessage += `\nDirección/Ciudad: ${address}`;
  orderMessage += `\nTeléfono: ${phone}`;
  if (message) {
    orderMessage += `\n\nMensaje adicional:\n${message}`;
  }

  // Mostrar el mensaje en la sección correspondiente
  const messageSection = document.getElementById('instagram-message-section');
  const messageElement = document.getElementById('instagram-message');
  
  if (messageSection && messageElement) {
    messageElement.textContent = orderMessage;
    messageSection.style.display = 'block';
    messageSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function copyInstagramMessage() {
  const messageElement = document.getElementById('instagram-message');
  if (messageElement) {
    const text = messageElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.className = 'cart-notification';
      notification.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
          <i class="fas fa-check-circle me-2"></i>Mensaje copiado al portapapeles
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    }).catch(err => {
      console.error('Error al copiar el mensaje:', err);
      alert('No se pudo copiar el mensaje. Por favor, cópialo manualmente.');
    });
  }
}

// Carrito arrastrable en móvil
function makeCartDraggable() {
  const cart = document.getElementById('cart');
  if (!cart) return;
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  function onTouchStart(e) {
    if (window.innerWidth > 768) return;
    isDragging = true;
    cart.classList.add('dragging');
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    const rect = cart.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    document.body.style.userSelect = 'none';
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    const touch = e.touches[0];
    let dx = touch.clientX - startX;
    let dy = touch.clientY - startY;
    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;
    // Limitar dentro de la ventana
    newLeft = Math.max(0, Math.min(window.innerWidth - cart.offsetWidth, newLeft));
    newTop = Math.max(0, Math.min(window.innerHeight - cart.offsetHeight, newTop));
    cart.style.left = newLeft + 'px';
    cart.style.top = newTop + 'px';
    cart.style.right = 'auto';
    cart.style.bottom = 'auto';
    cart.style.position = 'fixed';
  }

  function onTouchEnd() {
    isDragging = false;
    cart.classList.remove('dragging');
    document.body.style.userSelect = '';
  }

  cart.addEventListener('touchstart', onTouchStart);
  cart.addEventListener('touchmove', onTouchMove);
  cart.addEventListener('touchend', onTouchEnd);
}

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  updateCart();
  updateCartCount();
  makeCartDraggable();

  // Manejo de la pantalla de carga
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 2000);
  }

  // Manejo del menú responsivo
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', function() {
      navbarCollapse.classList.toggle('show');
    });

    // Cerrar el menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      });
    });

    // Cerrar el menú al hacer clic fuera
    document.addEventListener('click', function(event) {
      if (!navbarCollapse.contains(event.target) && !navbarToggler.contains(event.target)) {
        navbarCollapse.classList.remove('show');
      }
    });
  }
});

// Funcionalidad del botón de subir
window.onscroll = function() {
  const btnSubir = document.getElementById('btnSubir');
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnSubir.style.display = "flex";
  } else {
    btnSubir.style.display = "none";
  }
};

document.getElementById('btnSubir').onclick = function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}; 