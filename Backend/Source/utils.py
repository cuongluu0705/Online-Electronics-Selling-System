# File này chứa các method được sử dụng bởi toàn bộ project

import bcrypt

# Method để encrypt password với Bcrypt trước khi lưu vào DB
def hashPassword(str1: str):
    # Gen a random Salt
    salt = bcrypt.gensalt()

    # Convert input string to byte
    str1_bytes = str1.encode('utf-8')

    # Hash the input string using the salt
    str1_hash = bcrypt.hashpw(str1_bytes, salt)
    return str1_hash.decode('utf-8')

# Compare password with hash using salt in hash
def compareNormalandHash(input_password: str, stored_hash: str) -> bool:
    return bcrypt.checkpw(input_password.encode('utf-8'), stored_hash.encode('utf-8'))
if __name__ == "__main__":
    print(hashPassword("admin123"))
    print(hashPassword("staff123"))
    print(hashPassword("user123"))