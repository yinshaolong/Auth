import math

def is_palindrome(num):
    num_digits = int(math.log10(num)) + 1
    for i in range(num_digits // 2):
        if (num // 10**i) % 10 != (num // 10**(num_digits - i - 1)) % 10:
            return False
    return True
is_palindrome(123456)