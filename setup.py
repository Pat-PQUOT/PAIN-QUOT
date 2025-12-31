from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="pain_quotidien",
    version="0.0.1",
    description="App ERPNext pour l'association Pain Quotidien",
    author="Pain Quotidien",
    author_email="info@painquotidien.org",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires
)
