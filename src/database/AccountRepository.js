const { query } = require('.');

class AccountRepository {
  constructor() {
    this.query = query;
  }

  async create({ email, password }) {
    await this.query({
      command: 'INSERT INTO accounts (email, password) VALUES ($email, $password)',
      binds: {
        $email: email,
        $password: password,
      },
      method: 'run',
    });
  }

  async findByEmail(email) {
    const result = await this.query({
      command: 'select * from accounts where (email = $email)',
      binds: { $email: email },
      method: 'get',
    });
    return result;
  }
}

module.exports = { AccountRepository };
