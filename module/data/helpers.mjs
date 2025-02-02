

/**
 * Define a number field
 * @param {number} maxNumber    The max number the field can reach
 * @returns 
 */
export const defineNumberField = (maxNumber) => new NumberField({
    required: true,
    integer: true,
    nullable: false,
    min: 0,
    initial: 0,
    max: maxNumber
})

