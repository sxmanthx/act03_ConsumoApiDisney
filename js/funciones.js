const { createApp } = Vue

createApp({

    data() {
        return {
            personajes: [],
            busqueda: "",
            mostrarModal: false,
            seleccionado: {},
            nuevo: {
                nombre: "",
                imagen: "",
                peliculas: ""
            }
        }
    },

    mounted() {

        const datosGuardados = localStorage.getItem("personajesDisney")

        if (datosGuardados) {
            this.personajes = JSON.parse(datosGuardados)
        } else {

            fetch("https://api.disneyapi.dev/character")
                .then(r => r.json())
                .then(d => {

                    this.personajes = d.data

                    localStorage.setItem(
                        "personajesDisney",
                        JSON.stringify(this.personajes)
                    )
                })
        }
    },

    computed: {

        filtrados() {
            return this.personajes.filter(p =>
                p.name.toLowerCase()
                 .includes(this.busqueda.toLowerCase())
            )
        },

        porcentaje() {
            if (!this.personajes.length) return 0
            return Math.round(
                (this.filtrados.length / this.personajes.length) * 100
            )
        }
    },

    methods: {

        guardarLocal() {
            localStorage.setItem(
                "personajesDisney",
                JSON.stringify(this.personajes)
            )
        },

        verDetalle(p) {
            this.seleccionado = p
            this.mostrarModal = true
        },

        eliminar(id) {
            this.personajes =
                this.personajes.filter(p => p._id !== id)

            this.guardarLocal()
        },

        agregar() {

            if (!this.nuevo.nombre) return

            const listaPeliculas =
                this.nuevo.peliculas
                    ? this.nuevo.peliculas
                        .split(",")
                        .map(p => p.trim())
                    : []

            this.personajes.unshift({
                _id: Date.now(),
                name: this.nuevo.nombre,
                imageUrl: this.nuevo.imagen,
                films: listaPeliculas,
                tvShows: []
            })

            this.guardarLocal()

            this.nuevo.nombre = ""
            this.nuevo.imagen = ""
            this.nuevo.peliculas = ""
        }
    }

}).mount("#app")