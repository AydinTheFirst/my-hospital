/* eslint-disable */
export default async () => {
    const t = {};
    return { "@nestjs/swagger": { "models": [[import("./routes/appointments/appointments.dto"), { "CreateAppointmentDto": { date: { required: true, type: () => Date }, description: { required: true, type: () => String }, doctorId: { required: true, type: () => String }, hour: { required: true, type: () => String }, patientId: { required: true, type: () => String }, status: { required: true, type: () => Object }, title: { required: true, type: () => String } }, "UpdateAppointmentDto": {} }], [import("./routes/auth/auth.dto"), { "LoginDto": { password: { required: true, type: () => String }, username: { required: true, type: () => String } }, "RegisterDto": { birthDate: { required: true, type: () => Date }, email: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, nationalId: { required: true, type: () => String }, password: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, username: { required: true, type: () => String } } }], [import("./routes/notes/notes.dto"), { "CreateNoteDto": { appointmentId: { required: true, type: () => String }, description: { required: true, type: () => String }, title: { required: true, type: () => String }, type: { required: true, type: () => String }, userId: { required: true, type: () => String } }, "UpdateNoteDto": {} }], [import("./routes/users/users.dto"), { "CreateUserDto": { birthDate: { required: true, type: () => String }, email: { required: true, type: () => String }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, nationalId: { required: true, type: () => String }, password: { required: true, type: () => String }, phoneNumber: { required: true, type: () => String }, roles: { required: true, type: () => [Object] }, username: { required: true, type: () => String } }, "UpdateUserDto": {} }], [import("./routes/doctors/doctors.dto"), { "CreateDoctorDto": { bio: { required: true, type: () => String }, name: { required: true, type: () => String }, offDates: { required: true, type: () => [String] }, professionId: { required: true, type: () => String }, userId: { required: true, type: () => String }, workingHours: { required: true, type: () => String } }, "UpdateDoctorDto": {} }], [import("./routes/notes/note.entity"), { "Note": {} }], [import("./routes/professions/professions.dto"), { "CreateProfessionDto": { name: { required: true, type: () => String } }, "UpdateProfessionDto": {} }]], "controllers": [] } };
};