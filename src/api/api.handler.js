const mergeName = (firstName, lastName, birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    return firstName + ' ' + lastName + ' age ' + age;
}

module.exports = {
    mergeName,
}