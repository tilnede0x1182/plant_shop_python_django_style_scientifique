VENV=.venv
PYTHON=$(VENV)/bin/python
MANAGE=$(PYTHON) manage.py

install:
	clear && test -d $(VENV) || python3.11 -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip
	$(VENV)/bin/pip install -r requirements.txt

run:
	clear && $(MANAGE) runserver 127.0.0.1:8003

makemigrations:
	$(MANAGE) makemigrations plant_shop

# Equivalents Rails
db-create:
	@echo "SQLite : rien à créer."

db-migrate:
	$(MANAGE) migrate

db-drop:
	rm -f db.sqlite3

db-seed:
	clear && $(MANAGE) seed

db-reset:
	clear && $(MANAGE) flush --noinput
	$(MAKE) db-seed

db-setup: db-migrate db-seed
