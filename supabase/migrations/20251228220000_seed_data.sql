-- Insert seed data for vehicles

INSERT INTO public.vehicles (
    make, model, year, price, mileage, fuel_type, transmission, body_type, color, status, description, features, is_featured
) VALUES
(
    'Porsche', '911 Carrera S', 2023, 145000.00, 3500, 'petrol', 'automatic', 'Coupe', 'GT Silver Metallic', 'available',
    'A stunning example of the 992 generation 911 Carrera S. Finished in GT Silver with Black leather interior. Features Sport Chrono Package, Sport Exhaust, and 20/21 inch RS Spyder Design wheels.',
    '["Sport Chrono Package", "Sport Exhaust System", "Bose Surround Sound", "18-way Adaptive Sport Seats"]'::jsonb,
    true
),
(
    'Mercedes-Benz', 'G 63 AMG', 2022, 195000.00, 12000, 'petrol', 'automatic', 'SUV', 'Obsidian Black', 'available',
    'The iconic G-Wagon in its most powerful form. Handcrafted AMG V8 engine, Designo leather interior, and carbon fiber trim.',
    '["AMG Night Package", "22-inch Forged Wheels", "Massage Seats", "Burmester High-End 3D Surround Sound"]'::jsonb,
    true
),
(
    'Tesla', 'Model S Plaid', 2024, 89990.00, 500, 'electric', 'automatic', 'Sedan', 'Ultra Red', 'available',
    'The quickest accelerating car in production today. 1020 horsepower, tri-motor all-wheel drive, and yoke steering.',
    '["Full Self-Driving Capability", "21-inch Arachnid Wheels", "Cream Premium Interior", "Yoke Steering"]'::jsonb,
    false
);

-- Grant permissions just in case
GRANT SELECT ON public.vehicles TO anon;
GRANT SELECT ON public.vehicles TO authenticated;
