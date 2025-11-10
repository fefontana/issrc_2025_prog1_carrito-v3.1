import { CarritoModel } from '../model/CarritoModel.js';
import { CarritoView } from '../view/CarritoView.js';
import { debounce } from '../utils/debounce.js';

export class CarritoController {
  constructor() {
    this.model = new CarritoModel();
    this.view = new CarritoView();

    this.agregar = this.agregar.bind(this);
    this.modificar = this.modificar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.vaciar = this.vaciar.bind(this);

    this.init();
  }

  async init() {
    await this.model.cargarProductos();
    // render inicial
    this.view.renderProductos(this.model.productos, debounce(this.agregar, 220));
    this.view.btnVaciar.addEventListener('click', debounce(() => {
      if (!confirm('¿Vaciar carrito?')) return;
      this.vaciar();
    }, 200));
    this.view.btnCheckout.addEventListener('click', () => alert('Simulando pago - no implementado'));

    this._renderAll();
  }

  agregar(id) {
    const res = this.model.agregarAlCarrito(id);
    if (!res.ok) return alert(res.msg);
    this._renderAll();
  }

  modificar(id, delta) {
    const res = this.model.modificarCantidad(id, delta);
    if (res && !res.ok) return alert(res.msg);
    this._renderAll();
  }

  eliminar(id) {
    this.model.eliminarProducto(id);
    this._renderAll();
  }

  vaciar() {
    this.model.vaciarCarrito();
    this._renderAll();
  }

  _renderAll() {
    // render productos con listeners (no debounce aquí para que reciba la función ya establecida)
    this.view.renderProductos(this.model.productos, debounce(this.agregar, 220));
    this.view.renderCarrito(this.model.carrito, this.model.calcularTotal(), this.modificar, this.eliminar);
  }
}
