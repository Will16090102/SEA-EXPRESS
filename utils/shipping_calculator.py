def calculate_shipping(product_type, weight, price, dimensional_weight=0):
    """
    Calculate shipping costs based on product details
    
    Args:
        product_type (str): Type of product being shipped
        weight (float): Weight in kg
        price (float): Price in USD
        dimensional_weight (float): Calculated dimensional weight
    
    Returns:
        dict: Shipping cost details
    """
    # Base rates for different shipping methods
    rates = {
        'standard': {
            'base_rate': 12.50,
            'per_kg': 3.75,
            'insurance_percent': 0.03,
            'handling': 2.00
        },
        'express': {
            'base_rate': 18.00,
            'per_kg': 5.25,
            'insurance_percent': 0.04,
            'handling': 3.50
        },
        'priority': {
            'base_rate': 25.00,
            'per_kg': 7.00,
            'insurance_percent': 0.05,
            'handling': 5.00
        }
    }
    
    # Additional fees for special product types
    additional_fees = {
        'electronics': 5.00,
        'fragile': 7.50,
        'heavy': 10.00,
        'oversized': 15.00,
        'standard': 0.00
    }
    
    # Use the greater of actual weight or dimensional weight
    effective_weight = max(weight, dimensional_weight)
    
    # Calculate costs for all shipping methods
    shipping_options = {}
    
    for method, rate in rates.items():
        # Base calculation
        weight_cost = rate['base_rate'] + (effective_weight * rate['per_kg'])
        insurance = price * rate['insurance_percent']
        product_fee = additional_fees.get(product_type, 0)
        handling = rate['handling']
        
        # Customs and taxes estimate (simplified)
        customs_estimate = price * 0.10 if price > 200 else 0
        
        # Calculate total
        total = weight_cost + insurance + product_fee + handling + customs_estimate
        
        # Format results
        shipping_options[method] = {
            'weight_cost': round(weight_cost, 2),
            'insurance': round(insurance, 2),
            'product_fee': round(product_fee, 2),
            'handling': round(handling, 2),
            'customs_estimate': round(customs_estimate, 2),
            'total': round(total, 2)
        }
    
    # Get details for summary
    estimate_days = {
        'standard': '10-15',
        'express': '5-8',
        'priority': '3-5'
    }
    
    return {
        'success': True,
        'shipping_options': shipping_options,
        'effective_weight': round(effective_weight, 2),
        'product_price': price,
        'product_type': product_type,
        'estimate_days': estimate_days
    }
