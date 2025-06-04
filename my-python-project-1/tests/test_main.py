import unittest
from src.main import main_function

class TestMain(unittest.TestCase):

    def test_main_function(self):
        self.assertEqual(main_function(), "Hello, World!")

if __name__ == '__main__':
    unittest.main()