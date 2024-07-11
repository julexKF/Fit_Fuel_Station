class ClickSpark extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.root = document.documentElement;
    this.svg;
  }

  get activeEls() {
    return this.getAttribute("active-on");
  }

  connectedCallback() {
    this.setupSpark();

    this.root.addEventListener("click", (e) => {
      if (this.activeEls && !e.target.matches(this.activeEls)) return;

      this.setSparkPosition(e);
      this.animateSpark();
    });
  }

  animateSpark() {
    let sparks = [...this.svg.children];
    let size = parseInt(sparks[0].getAttribute("y1"));
    let offset = size / 2 + "px";

    let keyframes = (i) => {
      let deg = `calc(${i} * (360deg / ${sparks.length}))`;

      return [
        {
          strokeDashoffset: size * 3,
          transform: `rotate(${deg}) translateY(${offset})`
        },
        {
          strokeDashoffset: size,
          transform: `rotate(${deg}) translateY(0)`
        }
      ];
    };

    let options = {
      duration: 660,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      fill: "forwards"
    };

    sparks.forEach((spark, i) => spark.animate(keyframes(i), options));
  }

  setSparkPosition(e) {
    let rect = this.root.getBoundingClientRect();

    this.svg.style.left =
      e.clientX - rect.left - this.svg.clientWidth / 2 + "px";
    this.svg.style.top =
      e.clientY - rect.top - this.svg.clientHeight / 2 + "px";
  }

  setupSpark() {
    let template = `
      <style>
        :host {
          display: contents;
        }
        
        svg {
          pointer-events: none;
          position: absolute;
          rotate: -20deg;
          stroke: var(--click-spark-color, currentcolor);
        }

        line {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          transform-origin: center;
        }
      </style>
      <svg width="30" height="30" viewBox="0 0 100 100" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
        ${Array.from(
      { length: 8 },
      (_) => `<line x1="50" y1="30" x2="50" y2="4"/>`
    ).join("")}
      </svg>
    `;

    this.shadowRoot.innerHTML = template;
    this.svg = this.shadowRoot.querySelector("svg");
  }
}

customElements.define("click-spark", ClickSpark);

/** Demo scripts **/

const spark = document.querySelector("click-spark");
const colorPicker = document.getElementById("click-spark-color");

colorPicker.addEventListener("change", (e) => {
  spark.style.setProperty("--click-spark-color", e.target.value);
});


const MIN_SPEED = 1.5
const MAX_SPEED = 2.5

function randomNumber(min, max) {
  return Math.random() * (max - min) + min
}

class Blob {
  constructor(el) {
    this.el = el
    const boundingRect = this.el.getBoundingClientRect()
    this.size = boundingRect.width
    this.initialX = randomNumber(0, window.innerWidth - this.size)
    this.initialY = randomNumber(0, window.innerHeight - this.size)
    this.el.style.top = `${this.initialY}px`
    this.el.style.left = `${this.initialX}px`
    this.vx =
      randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1)
    this.vy =
      randomNumber(MIN_SPEED, MAX_SPEED) * (Math.random() > 0.5 ? 1 : -1)
    this.x = this.initialX
    this.y = this.initialY
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.x >= window.innerWidth - this.size) {
      this.x = window.innerWidth - this.size
      this.vx *= -1
    }
    if (this.y >= window.innerHeight - this.size) {
      this.y = window.innerHeight - this.size
      this.vy *= -1
    }
    if (this.x <= 0) {
      this.x = 0
      this.vx *= -1
    }
    if (this.y <= 0) {
      this.y = 0
      this.vy *= -1
    }
  }

  move() {
    this.el.style.transform = `translate(${this.x - this.initialX}px, ${this.y - this.initialY
      }px)`
  }
}

function initBlobs() {
  const blobEls = document.querySelectorAll('.bouncing-blob')
  const blobs = Array.from(blobEls).map((blobEl) => new Blob(blobEl))

  function update() {
    requestAnimationFrame(update)
    blobs.forEach((blob) => {
      blob.update()
      blob.move()
    })
  }

  requestAnimationFrame(update)
}

initBlobs()


// Menu
document.querySelectorAll('.List li').forEach(item => {
  item.addEventListener('click', event => {
    // Elimina la clase 'clicked' de todos los elementos
    document.querySelectorAll('.List li').forEach(li => {
      li.classList.remove('clicked');
    });

    // Añade la clase 'clicked' solo al elemento presionado
    item.classList.add('clicked');
  });
});

//carrito

$(document).ready(function () {
  $(".filter").click(function () {
      var filterValue = $(this).data('filter');
      if (filterValue === 'todo') {
          $('.grid--cell').show();
      } else {
          $('.grid--cell').hide();
          $('.grid--cell[data-category*="' + filterValue + '"]').show();
      }
  });

  $(".add-to-cart").click(function (e) {
      e.preventDefault();
      var itemName = $(this).closest(".content--container").find(".title--text").text();
      addToCart(itemName);
  });

  $("#cart-toggle").click(function () {
      $("#cart").slideToggle();
  });

  $("#cart-close").click(function () {
      $("#cart").slideToggle();
  });

  $("#checkout").click(function (e) {
      e.preventDefault();
      transferToReceipt();
      $("#cart").slideToggle();
  });

  loadCart();
});

function addToCart(itemName) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var item = cart.find(item => item.name === itemName);
  if (item) {
      item.quantity++;
  } else {
      cart.push({ name: itemName, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function loadCart() {
  renderCart();
}

function renderCart() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var $cartContent = $(".cart-content");
  $cartContent.html("");
  if (cart.length === 0) {
      $cartContent.html("<p>No hay productos en el carrito.</p>");
  } else {
      cart.forEach(item => {
          $cartContent.append(`
              <div class="cart-item">
                  <span>${item.name}</span>
                  <div>
                      <button class="cart-decrement" data-item="${item.name}">-</button>
                      <span class="cart-quantity">${item.quantity}</span>
                      <button class="cart-increment" data-item="${item.name}">+</button>
                  </div>
              </div>
          `);
      });
  }
  $(".cart-increment").click(function () {
      var itemName = $(this).data("item");
      incrementItem(itemName);
  });
  $(".cart-decrement").click(function () {
      var itemName = $(this).data("item");
      decrementItem(itemName);
  });
}

function incrementItem(itemName) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var item = cart.find(item => item.name === itemName);
  if (item) {
      item.quantity++;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decrementItem(itemName) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var item = cart.find(item => item.name === itemName);
  if (item) {
      if (item.quantity > 1) {
          item.quantity--;
      } else {
          cart = cart.filter(item => item.name !== itemName);
      }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function transferToReceipt() {
  var cart = JSON.parse(localStorage.getItem("cartContent")) || [];
  var $receiptItems = $("#receipt-items");
  $receiptItems.html("");
  cart.forEach(item => {
      $receiptItems.append(`
          <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
          </tr>
      `);
  });
  // Actualiza la fecha de la boleta
  var currentDate = new Date().toLocaleDateString();
  $("#receipt-date").text(currentDate);
}

function redirectToPayment() {
  // Asegúrate de que los elementos del carrito se transfieren a la boleta antes de redirigir
  transferToReceipt();

  // Redirige a la página de pago
  window.location.href = "recibo.html";  // Reemplaza "pagina_de_pago.html" con la URL de destino
}


