from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__, 
                template_folder='templates',
                static_folder='static')
    app.config.from_object(Config)

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    from app.routes import auth, dashboard, expense, income
    app.register_blueprint(auth.bp)
    app.register_blueprint(dashboard.bp, url_prefix='/dashboard')
    app.register_blueprint(expense.bp, url_prefix='/expense')
    app.register_blueprint(income.bp, url_prefix='/income')

    @app.route('/')
    def index():
        return redirect(url_for('auth.login'))

    return app
