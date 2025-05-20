import os
import logging
from flask import Flask, render_template, request, jsonify
from shipping_rates import calculate_shipping_cost

# Configure logging for easier debugging
logging.basicConfig(level=logging.DEBUG)

# Create Flask application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "sea-express-dev-key")

@app.route('/')
def index():
    """Render the main shipping calculator page"""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """Calculate shipping cost based on form inputs"""
    try:
        # Get form data
        product_weight = float(request.form.get('weight', 0))
        product_price = float(request.form.get('price', 0))
        product_type = request.form.get('product_type', '')
        
        # Validate input
        if product_weight < 0.1:
            return jsonify({
                'error': True,
                'message': 'El peso mínimo permitido es 0.1 kg.'
            }), 400
            
        if product_price < 1:
            return jsonify({
                'error': True,
                'message': 'El valor mínimo del producto es $1 USD.'
            }), 400
            
        # Calculate costs (we're only doing air shipping for now)
        result = calculate_shipping_cost(
            weight=product_weight,
            price=product_price,
            product_type=product_type
        )
        
        # Add weight information to the result
        result['weight'] = round(product_weight, 2)
        
        return jsonify(result)
    
    except ValueError as e:
        logging.error(f"Value error in calculation: {str(e)}")
        return jsonify({
            'error': True,
            'message': 'Por favor, ingrese valores numéricos válidos.'
        }), 400
    
    except Exception as e:
        logging.error(f"Error during calculation: {str(e)}")
        return jsonify({
            'error': True,
            'message': 'Ha ocurrido un error durante el cálculo. Por favor, inténtelo de nuevo.'
        }), 500

@app.route('/amazon-product', methods=['POST'])
def amazon_product():
    """Get product information from Amazon URL (simulated for now)"""
    try:
        url = request.form.get('url', '')
        
        if not url:
            return jsonify({
                'error': True,
                'message': 'URL no proporcionada'
            }), 400
            
        # For now, we'll return dummy product data
        # In a real implementation, this would scrape Amazon
        product_data = {
            'name': 'Producto de Amazon (simulado)',
            'price': 99.99,
            'weight': 1.5,
            'product_type': 'Electrónica'
        }
        
        return jsonify(product_data)
        
    except Exception as e:
        logging.error(f"Error processing Amazon URL: {str(e)}")
        return jsonify({
            'error': True,
            'message': 'No se pudo obtener información del producto. Por favor, ingrese los datos manualmente.'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
