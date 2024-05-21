const mergeName = (firstName, lastName, birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate); // แปลง string เป็น Date
    let age = today.getFullYear() - birth.getFullYear();

    // ตรวจสอบเดือนเกิด และวันเกิดว่าผ่านมาหรือยัง?
    if (today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
        age--;
    }

    // ตรวจสอบความถูกต้องของปีเกิด
    if (age <= 0) {
        return `Invalid birth year for ${firstName} ${lastName}`;
    }

    return firstName + ' ' + lastName + ' ' + 'Age is ' + age;
}

module.exports = {
    mergeName,
}
