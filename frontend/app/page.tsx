
"use client";

import { useMemo, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
};

const productosIniciales: Producto[] = [
  { id: 1, nombre: "Juego de sábanas matrimonial", categoria: "Sábanas", precio: 450, stock: 12 },
  { id: 2, nombre: "Toalla de baño", categoria: "Toallas", precio: 180, stock: 25 },
  { id: 3, nombre: "Cobertor individual", categoria: "Cobertores", precio: 520, stock: 4 },
  { id: 4, nombre: "Mantel rectangular", categoria: "Manteles", precio: 230, stock: 8 },
];

export default function Home() {
  const [productos, setProductos] = useState(productosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Sábanas");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const productosFiltrados = useMemo(
    () =>
      productos.filter((producto) =>
        `${producto.nombre} ${producto.categoria}`
          .toLowerCase()
          .includes(busqueda.toLowerCase())
      ),
    [productos, busqueda]
  );

  const valorInventario = productos.reduce(
    (total, producto) => total + producto.precio * producto.stock,
    0
  );

  function agregarProducto(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!nombre.trim() || Number(precio) <= 0 || stock === "" || Number(stock) < 0) {
      alert("Escribe un nombre, un precio mayor a cero y existencias válidas.");
      return;
    }

    setProductos((actuales) => [
      ...actuales,
      {
        id: Date.now(),
        nombre: nombre.trim(),
        categoria,
        precio: Number(precio),
        stock: Number(stock),
      },
    ]);

    setNombre("");
    setPrecio("");
    setStock("");
  }

  function eliminarProducto(id: number) {
    setProductos((actuales) => actuales.filter((producto) => producto.id !== id));
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900 px-6 py-5 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-300">Sistema administrativo</p>
            <h1 className="text-2xl font-bold">Blancos y Confecciones</h1>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm text-emerald-300">
            Inventario
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <section>
          <h2 className="text-2xl font-bold">Panel de inventario</h2>
          <p className="mt-1 text-slate-600">
            Consulta y administra los productos de tu tienda.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Productos registrados</p>
            <p className="mt-2 text-3xl font-bold">{productos.length}</p>
          </article>
          <article className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Unidades disponibles</p>
            <p className="mt-2 text-3xl font-bold">
              {productos.reduce((total, producto) => total + producto.stock, 0)}
            </p>
          </article>
          <article className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Valor estimado del inventario</p>
            <p className="mt-2 text-3xl font-bold">
              {valorInventario.toLocaleString("es-MX", {
                style: "currency",
                currency: "MXN",
                maximumFractionDigits: 2,
              })}
            </p>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <form
            onSubmit={agregarProducto}
            className="space-y-4 rounded-xl bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-bold">Registrar producto</h3>

            <label className="block text-sm font-medium">
              Nombre del producto
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-normal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Almohada estándar"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Categoría
              <select
                className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-normal"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option>Sábanas</option>
                <option>Toallas</option>
                <option>Cobertores</option>
                <option>Manteles</option>
                <option>Confecciones</option>
                <option>Otros</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              Precio (MXN)
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-normal"
                type="number"
                min="0.01"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Existencias
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 p-3 font-normal"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                required
              />
            </label>

            <button
              className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700"
              type="submit"
            >
              Agregar producto
            </button>
          </form>

          <section className="min-w-0 rounded-xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold">Productos</h3>
              <input
                className="w-full rounded-lg border border-slate-300 p-2 sm:w-64"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto..."
                aria-label="Buscar producto"
              />
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-3">Producto</th>
                    <th className="p-3">Precio</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id} className="border-b border-slate-100">
                      <td className="p-3">
                        <p className="font-medium">{producto.nombre}</p>
                        <p className="text-xs text-slate-500">{producto.categoria}</p>
                      </td>
                      <td className="p-3">
                        {producto.precio.toLocaleString("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        })}
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            producto.stock <= 5
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {producto.stock}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          className="font-medium text-red-600 hover:underline"
                          onClick={() => eliminarProducto(producto.id)}
                          type="button"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {productosFiltrados.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-slate-500" colSpan={4}>
                        No se encontraron productos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <p className="text-center text-sm text-slate-500">
          Proyecto académico · Versión inicial del inventario
        </p>
      </div>
    </main>
  );
}
