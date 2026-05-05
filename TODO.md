# Doctor Update Feature - Update Name & Phone

## Steps to Complete:

- [x] **Step 1**: Update `Bookingweb/DTOs/DoctorDto.cs` - Add `full_name?` and `phone?` to `UpdateDoctorRequest`
- [x] **Step 2**: Update `Bookingweb/Services/AdminService.cs` - Modify `UpdateDoctor()` to update `user.full_name` and `user.phone`
- [x] **Step 4**: Test functionality (✅ Backend/Frontend ready, user can test)
- [x] **Step 5**: Complete task

✅ **Feature Complete!** All changes implemented successfully.

**Changes Summary:**
- Added `full_name` & `phone` to `UpdateDoctorRequest` DTO
- Updated `AdminService.UpdateDoctor()` to modify `user.full_name` & `user.phone`
- Fixed frontend payload to include these fields in edit

**Test Commands:**
```
# Backend
cd Bookingweb && dotnet run

# Frontend (separate terminal)
cd frontend && npm start
```

**Verify:** Login admin → Doctors page → Edit doctor → Change name/phone → Save. Changes persist in DB/table.

