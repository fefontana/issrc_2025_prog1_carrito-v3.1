export class CarritoView {
  constructor() {
    this.listaProductos = document.getElementById('productos-list');
    this.listaCarrito = document.getElementById('carrito-list');
    this.total = document.getElementById('total');
    this.btnVaciar = document.getElementById('vaciar-carrito');
    this.btnCheckout = document.getElementById('checkout');
  }

  // Render dinámico usando createElement, appendChild, className, img, etc.
  renderProductos(productos, onAgregar) {
    // limpiar hijos usando removeChild
    while (this.listaProductos.firstChild) {
      this.listaProductos.removeChild(this.listaProductos.firstChild);
    }

    productos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'producto';

      const left = document.createElement('div');
      left.className = 'prod-left';

      const img = document.createElement('img');
      img.className = 'producto-img';
      img.src = p.imagen || '';
      img.alt = p.nombre;

      const info = document.createElement('div');
      info.className = 'prod-info';
      const name = document.createElement('span');
      name.className = 'prod-name';
      name.textContent = p.nombre;
      const price = document.createElement('span');
      price.className = 'prod-price';
      price.textContent = '$' + p.precio;

      info.appendChild(name);
      info.appendChild(price);

      left.appendChild(img);
      left.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'prod-actions';
      const btn = document.createElement('button');
      btn.className = 'btn primary';
      btn.textContent = 'Agregar';
      btn.dataset.id = p.id;
      btn.addEventListener('click', () => onAgregar(p.id));

      actions.appendChild(btn);

      card.appendChild(left);
      card.appendChild(actions);

      this.listaProductos.appendChild(card);
    });
  }

  renderCarrito(carrito, total, onModificar, onEliminar) {
    // limpiar
    while (this.listaCarrito.firstChild) {
      this.listaCarrito.removeChild(this.listaCarrito.firstChild);
    }

    if (carrito.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'small';
      empty.textContent = 'El carrito está vacío';
      this.listaCarrito.appendChild(empty);
    } else {
      carrito.forEach(it => {
        const item = document.createElement('div');
        item.className = 'carrito-item';
        item.innerHTML = `<span class="prod-name">${it.nombre}</span>
                          <span class="small">$${it.precio} x ${it.cantidad} = $${it.precio * it.cantidad}</span>`;
        const actions = document.createElement('div');
        actions.className = 'prod-actions';

        const btnMinus = document.createElement('button');
        btnMinus.className = 'btn secondary';
        btnMinus.textContent = '➖';
        btnMinus.addEventListener('click', () => onModificar(it.id, -1));

        const btnPlus = document.createElement('button');
        btnPlus.className = 'btn primary';
        btnPlus.textContent = '➕';
        btnPlus.addEventListener('click', () => onModificar(it.id, 1));

        const btnDel = document.createElement('button');
        btnDel.className = 'btn secondary';
        btnDel.textContent = 'Eliminar';
        btnDel.addEventListener('click', () => onEliminar(it.id));

        actions.appendChild(btnMinus);
        actions.appendChild(btnPlus);
        actions.appendChild(btnDel);

        item.appendChild(actions);
        this.listaCarrito.appendChild(item);
      });
    }

    this.total.textContent = 'Total: $' + total;
  }
}
