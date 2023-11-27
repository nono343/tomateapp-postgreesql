import os
from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    unset_jwt_cookies,
    jwt_required,
)
from datetime import datetime, timedelta, timezone
import json
from werkzeug.utils import secure_filename
from app import api, bcrypt, db, jwt, flash, redirect
from models import User,Categorias, Productos,MesesProduccion , Packagings   
from util import allowed_file  # Importa la función allowed_file desde util.py
from flask import send_from_directory

@api.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required


from flask_jwt_extended import create_access_token

@api.route('/logintoken', methods=["POST"])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(username=username).first()
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Wrong username or password"}), 401

    # Imprime información antes de crear el token
    print("User ID:", user.id)
    print("Username:", user.username)

    # Modifica la creación del token para incluir la ruta completa de la foto
    foto_path = f"http://localhost:5000/uploads/{user.foto}" if user.foto else None

    # Crea el token con información adicional en la carga útil
    access_token = create_access_token(
        identity=user.id,
        additional_claims={
            "username": user.username,
            "isAdmin": user.isAdmin,
            "foto": foto_path  # Cambia aquí para incluir la ruta completa
        }
    )

    # Imprime el token antes de devolverlo en la respuesta
    print("Access Token:", access_token)

    # Devuelve la respuesta con el token
    return jsonify({
        "id": user.id,
        "username": user.username,
        "access_token": access_token,
        "isAdmin": user.isAdmin,
        "foto": foto_path
    })

@api.route("/signup", methods=["POST"])
def signup():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    username = request.form.get("username", None)
    password = request.form.get("password", None)

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(os.path.abspath(api.config['UPLOAD_FOLDER']), filename))

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user_exists = User.query.filter_by(username=username).first()
    if user_exists:
        return jsonify({"error": "Username already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, password=hashed_password, isAdmin=request.form.get("isAdmin", "user"), foto=filename)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "isAdmin": new_user.isAdmin,
        "foto": new_user.foto
    })
 
 # Ruta para obtener la información de los usuarios
@api.route('/users', methods=['GET'])
def get_users():
    # Obtén la lista de usuarios (en este ejemplo, devuelve todos los usuarios)
    users = User.query.all()

    # Serializa la información de los usuarios (devuelve solo id y username)
    serialized_users = [{'id': user.id, 'username': user.username} for user in users]
    return jsonify({'users': serialized_users})


@api.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response
 
@api.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response
 
@api.route('/profile/<getusername>')
@jwt_required() 
def my_profile(getusername):
    if not getusername:
        return jsonify({"error": "Unauthorized Access"}), 401
       
    user = User.query.filter_by(username=getusername).first()
  
    response_body = {
        "id": user.id,
        "username": user.username,
        "isAdmin" : user.isAdmin
    }
  
    return response_body


@api.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(os.path.abspath(api.config['UPLOAD_FOLDER']), filename))
        return "File uploaded successfully"  # Puedes personalizar este mensaje
    else:
        flash('Invalid file type')
        return redirect(request.url)

@api.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(api.config['UPLOAD_FOLDER'], filename)


@api.route('/upload_category', methods=['POST'])
def upload_category():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    nombreesp = request.form['nombreesp']
    nombreeng = request.form['nombreeng']

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(os.path.abspath(api.config['UPLOAD_FOLDER']), filename))


        # Aquí puedes guardar la categoría con la foto en tu base de datos en la tabla Categorias
        nueva_categoria = Categorias(nombreesp=nombreesp, nombreeng=nombreeng, foto=filename)
        db.session.add(nueva_categoria)
        db.session.commit()

        return jsonify({'message': 'Category uploaded successfully'}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400


@api.route('/categorias', methods=['GET'])
def get_categories():
    categories = Categorias.query.all()  # Consulta todas las categorías en la base de datos
    category_list = []

    for category in categories:
        category_data = {
            'id': category.id,
            'nombreesp': category.nombreesp,
            'nombreeng': category.nombreeng,
            'foto': category.foto
        }
        category_list.append(category_data)

    return jsonify(categories=category_list)




@api.route('/categorias/<int:categoria_id>', methods=['GET'])
def get_category_by_id(categoria_id):
    try:
        # Obtener la categoría por su ID
        category = Categorias.query.get(categoria_id)

        if category is None:
            return jsonify({'error': 'Categoría no encontrada'}), 404

        # Crear un diccionario con la información de la categoría
        category_data = {
            'id': category.id,
            'nombreesp': category.nombreesp,
            'nombreeng': category.nombreeng,
            'foto': category.foto
            # Puedes agregar más campos según tus necesidades
        }

        return jsonify(category=category_data), 200
    except Exception as e:
        # Manejo de errores
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


@api.route('/categorias/<int:id>', methods=['DELETE'])
def delete_categoria(id):
    # Buscar la categoría por ID
    categoria = Categorias.query.get(id)

    if categoria is None:
        return jsonify({'message': 'Categoría no encontrada'}), 404

    try:
        # Eliminar la categoría de la base de datos
        db.session.delete(categoria)
        db.session.commit()
        return jsonify({'message': 'Categoría eliminada correctamente'}), 200
    except Exception as e:
        # En caso de error al eliminar, realiza un rollback y devuelve un mensaje de error
        db.session.rollback()
        return jsonify({'message': 'Error al eliminar la categoría', 'error': str(e)}), 500

# Ruta para crear un nuevo producto
@api.route('/upload_product', methods=['POST'])
def upload_product():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'At least one file is required'}), 400

        file = request.files['file']
        file2 = request.files.get('file2')  # Use get to allow file2 to be None

        if file.filename == '':
            return jsonify({'error': 'No selected file for the first photo'}), 400

        nombreesp = request.form['nombreesp']
        nombreeng = request.form['nombreeng']
        descripcionesp = request.form['descripcionesp']
        descripcioneng = request.form['descripcioneng']
        categoria_id = request.form['categoria']

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filename2 = None

            if file2 and allowed_file(file2.filename):
                filename2 = secure_filename(file2.filename)
                file2.save(os.path.join(api.config['UPLOAD_FOLDER'], filename2))

            file.save(os.path.join(api.config['UPLOAD_FOLDER'], filename))

            nuevo_producto = Productos(
                nombreesp=nombreesp,
                nombreeng=nombreeng,
                descripcionesp=descripcionesp,
                descripcioneng=descripcioneng,
                categoria_id=categoria_id,
                foto=filename,
                foto2=filename2,
            )

            db.session.add(nuevo_producto)
            db.session.commit()

            return jsonify({'message': 'Product uploaded successfully'}), 200
        else:
            return jsonify({'error': 'Invalid file type'}), 400
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

# Ruta para ver todos los productos
@api.route('/productos', methods=['GET'])
def get_products():
    try:
        # Obtén el término de búsqueda del parámetro de consulta
        search_term = request.args.get('nombre', '')

        # Realiza la consulta filtrando por el nombre del producto
        products = Productos.query.filter(Productos.nombreesp.ilike(f'%{search_term}%')).all()

        # Resto del código para construir la respuesta (similar al anterior)
        product_list = []  # Asegúrate de definir product_list

        for product in products:
            # Consulta los packagings asociados a cada producto
            packagings = product.packagings  # Utiliza la relación packagings definida en el modelo Productos

            # Consulta los meses de producción asociados a cada producto
            meses = product.meses_produccion
            meses_de_produccion = [{'id': mes.id, 'mes': mes.mes} for mes in meses]

            # Crea una lista de datos de packaging asociados al producto
            packaging_list = []
            for packaging in packagings:
                users = [user.username for user in packaging.users]  # Accede a los usuarios asociados al packaging
                packaging_data = {
                    'id': packaging.id,
                    'nombreesp': packaging.nombreesp,
                    'nombreeng': packaging.nombreeng,
                    'marca': packaging.marca,
                    'presentacion': packaging.presentacion,
                    'calibre': packaging.calibre,
                    'peso_presentacion_g': packaging.peso_presentacion_g,
                    'peso_neto_kg': packaging.peso_neto_kg,
                    'tamano_caja': packaging.tamano_caja,
                    'pallet_80x120': packaging.pallet_80x120,
                    'peso_neto_pallet_80x120_kg': packaging.peso_neto_pallet_80x120_kg,
                    'pallet_100x120': packaging.pallet_100x120,
                    'peso_neto_pallet_100x120_kg': packaging.peso_neto_pallet_100x120_kg,
                    'foto': packaging.foto,
                    'foto2': packaging.foto2,
                    'producto_id': packaging.producto_id,
                    'users': users,  # Agrega la lista de usuarios al diccionario de packaging_data
                }
                packaging_list.append(packaging_data)

            # Crea un diccionario de datos del producto y sus packagings y meses de producción asociados
            product_data = {
                'id': product.id,
                'nombreesp': product.nombreesp,
                'nombreeng': product.nombreeng,
                'descripcionesp': product.descripcionesp,
                'descripcioneng': product.descripcioneng,
                'categoria_id': product.categoria_id,
                'foto': product.foto,
                'foto2': product.foto2,
                'packagings': packaging_list,
                'meses_de_produccion': meses_de_produccion,
            }
            product_list.append(product_data)

        return jsonify(products=product_list), 200
    except Exception as e:
        # Manejo de errores
        return jsonify({'error': str(e)}), 500




# Ruta para borrar productos
@api.route('/productos/<int:producto_id>', methods=['DELETE'])
def borrar_producto(producto_id):
    producto = Productos.query.get(producto_id)
    if producto:
        db.session.delete(producto)
        db.session.commit()
        return jsonify({'mensaje': 'Producto borrado correctamente'}), 200
    else:
        return jsonify({'mensaje': 'Producto no encontrado'}), 404



# Ruta para obtener los meses de producción asociados a un producto
@api.route('/productos/<int:producto_id>/meses', methods=['GET'])
def obtener_meses_de_produccion(producto_id):
    try:
        producto = Productos.query.get(producto_id)
        meses = MesesProduccion.query.filter_by(producto_id=producto_id).all()

        meses_de_produccion = [{'id': mes.id, 'mes': mes.mes} for mes in meses]

        return jsonify(producto_id=producto_id, meses_de_produccion=meses_de_produccion), 200
    except Exception as e:
        print(f"Error al obtener los meses de producción del producto: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500

# Ruta para agregar meses de producción a un producto
@api.route('/productos/<int:producto_id>/meses/agregar', methods=['POST'])
def agregar_meses_de_produccion(producto_id):
    try:
        data = request.get_json()
        nuevos_meses = data.get('meses', [])

        for nuevo_mes in nuevos_meses:
            # Verifica si el mes ya existe para el producto
            mes_existente = MesesProduccion.query.filter_by(mes=nuevo_mes, producto_id=producto_id).first()

            if not mes_existente:
                mes = MesesProduccion(mes=nuevo_mes, producto_id=producto_id)
                db.session.add(mes)

        db.session.commit()

        return jsonify({'message': 'Meses de producción agregados con éxito'}), 201
    except Exception as e:
        print(f"Error al agregar los meses de producción al producto: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500

# Ruta para crear un nuevo packaging
@api.route('/upload_packaging', methods=['POST'])
def upload_packaging():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'At least one file is required'}), 400

        file = request.files['file']
        file2 = request.files.get('file2')  # Use get to allow file2 to be None

        if file.filename == '':
            return jsonify({'error': 'No selected file for the first photo'}), 400

        nombreesp = request.form['nombreesp']
        nombreeng = request.form['nombreeng']
        marca = request.form['marca']
        presentacion = request.form['presentacion']
        calibre = request.form['calibre']
        peso_presentacion_g = request.form['peso_presentacion_g']
        peso_neto_kg = request.form['peso_neto_kg']
        tamano_caja = request.form['tamano_caja']
        pallet_80x120 = request.form['pallet_80x120']
        peso_neto_pallet_80x120_kg = request.form['peso_neto_pallet_80x120_kg']
        pallet_100x120 = request.form['pallet_100x120']
        peso_neto_pallet_100x120_kg = request.form['peso_neto_pallet_100x120_kg']
        producto_id = request.form['producto_id']
        user_ids = request.form.getlist('user_ids')

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filename2 = None

            if file2 and allowed_file(file2.filename):
                filename2 = secure_filename(file2.filename)
                file2.save(os.path.join(api.config['UPLOAD_FOLDER'], filename2))

            file.save(os.path.join(api.config['UPLOAD_FOLDER'], filename))

            nuevo_packaging = Packagings(
                nombreesp=nombreesp,
                nombreeng=nombreeng,
                marca=marca,
                presentacion=presentacion,
                calibre=calibre,
                peso_presentacion_g=peso_presentacion_g,
                peso_neto_kg=peso_neto_kg,
                tamano_caja=tamano_caja,
                pallet_80x120=pallet_80x120,
                peso_neto_pallet_80x120_kg=peso_neto_pallet_80x120_kg,
                pallet_100x120=pallet_100x120,
                peso_neto_pallet_100x120_kg=peso_neto_pallet_100x120_kg,
                foto=filename,
                foto2=filename2,
                producto_id=producto_id
            )

            # Agrega nuevo_packaging a la sesión antes de operaciones relacionadas con la base de datos
            db.session.add(nuevo_packaging)
            db.session.commit()

            # Asigna los usuarios al packaging después de agregar a la sesión
            for user_id in user_ids:
                user = User.query.get(user_id)
                if user:
                    nuevo_packaging.users.append(user)

            # Realiza otro commit después de agregar usuarios
            db.session.commit()

        return jsonify({'message': 'Carga exitosa del embalaje'}), 200
    except Exception as e:
        # Registra el error en los registros del servidor
        print(f"Error en la carga del embalaje: {str(e)}")
        return jsonify({'error': 'Error interno del servidor'}), 500


# Ruta para obtener todos los packagings
@api.route('/packagings', methods=['GET'])
def get_packagings():
    try:
        packagings = Packagings.query.all()
        packaging_list = []

        for packaging in packagings:
            users = [{'id': user.id, 'username': user.username} for user in packaging.users]

            # Accede al nombre en español del producto a través de la relación
            packaging.producto.nombre = packaging.producto.nombreesp if packaging.producto else None

            packaging_data = {
                'id': packaging.id,
                'nombreesp': packaging.nombreesp,
                'nombreeng': packaging.nombreeng,
                'marca': packaging.marca,
                'presentacion': packaging.presentacion,
                'calibre': packaging.calibre,
                'peso_presentacion_g': packaging.peso_presentacion_g,
                'peso_neto_kg': packaging.peso_neto_kg,
                'tamano_caja': packaging.tamano_caja,
                'pallet_80x120': packaging.pallet_80x120,
                'peso_neto_pallet_80x120_kg': packaging.peso_neto_pallet_80x120_kg,
                'pallet_100x120': packaging.pallet_100x120,
                'peso_neto_pallet_100x120_kg': packaging.peso_neto_pallet_100x120_kg,
                'foto': packaging.foto,
                'foto2': packaging.foto2,
                'producto_id': packaging.producto_id,
                'nombreproducto': packaging.producto.nombre,  # Nuevo campo para el nombre del producto en español
                'users': users,
            }

            packaging_list.append(packaging_data)

        return jsonify(packagings=packaging_list), 200
    except Exception as e:
        # Manejo de errores
        return jsonify({'error': str(e)}), 500

# Ruta para editar usuarios asociados a un packaging
@api.route('/packagings/<int:packaging_id>/edit_users', methods=['PUT'])
def edit_packaging_users(packaging_id):
    try:
        # Obtener el packaging por su ID
        packaging = Packagings.query.get(packaging_id)

        # Verificar si el packaging existe
        if not packaging:
            return jsonify({'error': 'Packaging no encontrado'}), 404

        # Obtener datos de la solicitud JSON
        data = request.json

        # Verificar si se proporciona la lista de usuarios para actualizar
        if 'users' in data:
            new_users = data['users']

            # Limpiar la lista actual de usuarios asociados al packaging
            for existing_user in packaging.users:
                packaging.users.remove(existing_user)

            # Agregar nuevos usuarios al packaging
            for user_id in new_users:
                user = User.query.get(user_id)

                # Verificar si el usuario existe
                if user:
                    packaging.users.append(user)
                else:
                    return jsonify({'error': f'Usuario con ID {user_id} no encontrado'}), 404

            # Guardar los cambios en la base de datos
            db.session.commit()

            return jsonify({'message': 'Usuarios del packaging actualizados exitosamente'}), 200
        else:
            return jsonify({'error': 'Se requiere la lista de usuarios para actualizar'}), 400

    except Exception as e:
        # Manejo de errores
        print(f'Error en la ruta edit_packaging_users: {e}')
        return jsonify({'error': 'Error interno del servidor'}), 500






# Ruta para buscar productos por nombre dentro de una categoría
@api.route('/categorias/<int:categoria_id>/productos', methods=['GET'])
def search_products_in_category(categoria_id):
    try:
        # Obtén el término de búsqueda del parámetro de consulta
        search_term = request.args.get('nombre', '')

        # Obtener la categoría
        categoria = Categorias.query.get(categoria_id)

        if categoria is None:
            return jsonify({'error': 'Categoría no encontrada'}), 404

        # Obtener los productos de la categoría filtrando por nombre
        productos = Productos.query.filter(
            Productos.categoria_id == categoria.id,
            Productos.nombreesp.ilike(f'%{search_term}%')
        ).all()

        # Crear una lista para almacenar la información de cada producto
        productos_info = []

        for producto in productos:
            # Agregar información relevante del producto a la lista
            producto_info = {
                'id': producto.id,
                'nombreesp': producto.nombreesp,
                'nombreeng': producto.nombreeng,
                'foto': producto.foto,
                # Puedes agregar más campos según tus necesidades
            }
            productos_info.append(producto_info)

        # Devolver la lista de productos en formato JSON
        return jsonify({'categoria': {'nombreesp': categoria.nombreesp, 'nombreeng': categoria.nombreeng}, 'productos': productos_info})
    except Exception as e:
        # Manejo de errores
        return jsonify({'error': str(e)}), 500

# Ruta para obtener la información completa de un producto por su ID y categoría por su ID
@api.route('/categorias/<int:categoria_id>/productos/<int:producto_id>', methods=['GET'])
def get_product_info_by_category(categoria_id, producto_id):
    categoria = Categorias.query.get(categoria_id)

    if categoria:
        producto = Productos.query.filter_by(id=producto_id, categoria_id=categoria_id).first()

        if producto:
            # Obtener packagings del producto
            packagings = Packagings.query.filter_by(producto_id=producto_id).all()

            # Obtener meses de producción del producto
            meses_produccion = MesesProduccion.query.filter_by(producto_id=producto_id).all()

            # Crear un diccionario con la información del producto, packagings y meses de producción
            product_info = {
                "categoria": categoria.serialize(),
                "producto": producto.serialize(),
                "packagings": [packaging.serialize() for packaging in packagings],
                "meses_produccion": [mes.serialize() for mes in meses_produccion]
            }

            return jsonify(product_info)
        else:
            return jsonify({"error": "Producto no encontrado en la categoría especificada"}), 404
    else:
        return jsonify({"error": "Categoría no encontrada"}), 404



# Nueva ruta para eliminar packagings
@api.route('/packagings/<int:packaging_id>', methods=['DELETE'])
def delete_packaging(packaging_id):
    try:
        # Busca el packaging por ID
        packaging = Packagings.query.get(packaging_id)

        if packaging is None:
            return jsonify({'error': 'Packaging no encontrado'}), 404

        # Elimina el packaging de la base de datos
        db.session.delete(packaging)
        db.session.commit()

        return jsonify({'message': 'Packaging eliminado correctamente'}), 200
    except Exception as e:
        # Manejo de errores
        return jsonify({'error': str(e)}), 500
