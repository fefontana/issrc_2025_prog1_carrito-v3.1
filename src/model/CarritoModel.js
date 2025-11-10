export class CarritoModel {
  constructor() {
    this.productos = [];
    this.carrito = [];
  }

  async cargarProductos(url = './data/productos.json') {
    const res = await fetch(url);
    this.productos = await res.json();
  }

  crearArrayBasico() {
    // Devuelve solo id, nombre, precio (requisito)
    return this.productos.map(p => ({ id: p.id, nombre: p.nombre, precio: p.precio }));
  }

  agregarAlCarrito(id) {
    const producto = this.productos.find(p => p.id === id);
    if (!producto) return { ok:false, msg: 'Producto no encontrado' };
    if (producto.stock <= 0) return { ok:false, msg: 'Sin stock' };

    const item = this.carrito.find(it => it.id === id);
    producto.stock--;
    if (item) item.cantidad++;
    else this.carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad:1 });
    return { ok:true };
  }

  modificarCantidad(id, delta) {
    const item = this.carrito.find(it => it.id === id);
    const origen = this.productos.find(p => p.id === id);
    if (!item) return;
    if (delta === 1 && origen.stock <= 0) return { ok:false, msg:'Sin stock' };
    if (delta === -1 && item.cantidad === 1) {
      this.eliminarProducto(id);
      return { ok:true };
    }
    item.cantidad += delta;
    origen.stock -= delta;
    return { ok:true };
  }

  eliminarProducto(id) {
    const idx = this.carrito.findIndex(it => it.id === id);
    if (idx === -1) return;
    const item = this.carrito[idx];
    const origen = this.productos.find(p => p.id === id);
    if (origen) origen.stock += item.cantidad;
    this.carrito.splice(idx,1);
  }

  vaciarCarrito() {
    this.carrito.forEach(it => {
      const origen = this.productos.find(p => p.id === it.id);
      if (origen) origen.stock += it.cantidad;
    });
    this.carrito = [];
  }

  calcularTotal() {
    return this.carrito.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  }
}
