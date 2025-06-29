import express from 'express';
import RouterUsuarios from './router/usuarios.js';
import RouterAuth from './router/auth.js';
import CnxMongoDB from './model/DBMongo.js';
import cors from 'cors';
import RouterUbicacion from './router/ubicacion.js';


class Server {
    #port
    #server

    constructor(port) {
        this.#port = port;
        this.#server = null;
    }

    async start() {
        // ---------------------
        //      Express App
        // ---------------------
        const app = express();

        // ---------------------
        //       Middleware
        // ---------------------
        app.use(cors());
        app.use(express.json());

        // ---------------------
        //        Routing
        // ---------------------
        app.use('/api/usuarios', new RouterUsuarios().start());
        app.use('/api/auth', new RouterAuth().start());
        app.use('/api/ubicacion', new RouterUbicacion().start());


        // ----------------------------------------
        //        Conectar a la base de datos
        // ----------------------------------------
        await CnxMongoDB.conectar();

        // ---------------------
        //        Listener
        // ---------------------
        const PORT = this.#port;
        this.#server = app.listen(PORT, () => console.log(`Servidor express escuchando en http://localhost:${PORT}`));
        this.#server.on('error', error => console.log(`Error en servidor: ${error.message}`));

        return app;
    }

    async stop() {
        if (this.#server) {
            this.#server.close();
            await CnxMongoDB.desconectar();
            this.#server = null;
        }
    }
}

export default Server;