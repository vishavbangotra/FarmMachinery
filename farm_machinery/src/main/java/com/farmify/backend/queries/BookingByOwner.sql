SELECT
    b.id AS booking_id,
    b.machinery_id,
    b.requester_id,
    b.status,
    b.created_at,
    b.start_date,
    b.end_date,
    m.model_info,
    m.remarks,
    m.rent_per_day,
    m.farm_id,
    m.owner_id,
    f.description AS farm_description,
    f.latitude,
    f.longitude
FROM
    dev.booking b
    /* only join machinery that’s active (status = 0) */
    JOIN dev.machinery m ON m.id = b.machinery_id
    AND m.status = 0
    /* bring in farm details if present */
    LEFT JOIN dev.farm f ON m.farm_id = f.id;