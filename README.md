# Finlr

---

## Installation

### 1. Run
```bash
./vendor/bin/sail up -d
```
OR
```bash
docker compose up -d
```
OR
Create Alias
```bash
echo "alias sail='./vendor/bin/sail'" >> ~/.bashrc && source ~/.bashrc
```
Run
```bash
sail up -d
```

### 2. Generate key
```bash
sail artisan key:generate
sail artisan migrate
```

### 3. Run front
```bash
sail npm install
sail npm run dev
```
