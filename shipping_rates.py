"""
Shipping rates and calculation logic for SEA Express
"""

# Air shipping rates
SHIPPING_COST_PER_KG = 15.0  # $15 per kg
MIN_SHIPPING_COST = 12.0     # Minimum shipping cost ($12)
CUSTOMS_FEE = 8.0            # Fixed customs clearance fee ($8)
TAX_THRESHOLD = 200.0        # Value threshold for taxes
TAX_RATE = 0.25              # 25% tax rate for values over $200

def calculate_shipping_cost(weight, price, shipping_type=None, product_type=None):
    """
    Calculate shipping cost based on weight and price
    
    Args:
        weight (float): Weight of the package in kg
        price (float): Price of the product in USD
        shipping_type (str): Type of shipping (currently only aéreo)
        product_type (str): Optional product type description
        
    Returns:
        dict: Dictionary with detailed cost breakdown
    """
    # Apply minimum weight of 1 kg if weight is less than 1
    effective_weight = max(weight, 1.0)
    
    # Calculate shipping cost ($15 per kg)
    shipping_cost = effective_weight * SHIPPING_COST_PER_KG
    
    # Apply minimum shipping cost if necessary
    shipping_cost = max(shipping_cost, MIN_SHIPPING_COST)
    
    # Calculate tax if price exceeds $200
    import_tax = 0
    if price > TAX_THRESHOLD:
        import_tax = price * TAX_RATE
    
    # Calculate total shipping cost (shipping + customs fee)
    total_shipping = shipping_cost + CUSTOMS_FEE
    
    # Calculate total cost (product price + total shipping + tax)
    total = price + total_shipping + import_tax
    
    # Prepare detailed breakdown
    result = {
        'shipping_name': "Aéreo",
        'product_price': round(price, 2),
        'shipping_cost': round(shipping_cost, 2),
        'customs_fee': CUSTOMS_FEE,
        'import_tax': round(import_tax, 2),
        'total_shipping': round(total_shipping, 2),
        'total': round(total, 2),
        'error': False,
        'product_type': product_type
    }
    
    return result
