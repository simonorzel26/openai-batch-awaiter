
# OpenAI Batch Processing with NestJS

This project is a NestJS application designed to manage batch processing tasks with OpenAI's Batch API. It stores batch requests in an SQLite database, periodically checks the status of these batches using OpenAI's API, and triggers a webhook when a batch is completed. This setup is useful since OpenAI's Batch API does not provide native webhook support.

## Features

- **Batch Storage**: Store OpenAI batch processing requests in an SQLite database.
- **Batch Status Checking**: Periodically check the status of all batches stored in the database using OpenAI's API.
- **Webhook Triggering**: Automatically call a specified webhook URL when a batch is completed.
- **Persistence**: Uses SQLite for persistent data storage across deployments.

## Project Structure

```bash
src/
├── batch-awaiter/
│   ├── batch-awaiter.service.ts        # Handles storing batch requests in the database
│   ├── batch-awaiter.controller.ts     # Exposes an API to submit batch requests
│   ├── batch.entity.ts                 # Defines the BatchEntity for TypeORM
│   ├── batch-awaiter.module.ts         # Module that includes batch-related services and controllers
├── batch-status/
│   ├── batch-status-checker.service.ts # Checks the status of batches via OpenAI's API and updates the database
│   ├── batch-status-checker.scheduler.ts # Schedules the periodic checking of batch statuses
├── app.module.ts                       # Main application module
```

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **SQLite**: The application uses SQLite as the database, which is included with most Node.js installations.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/openai-batch-processor.git
   cd openai-batch-processor
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root of your project and add the following:

   ```bash
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_PATH=./database.sqlite
   ```

4. **Run the application:**

   ```bash
   npm run start:dev
   ```

### Usage

1. **Submit a Batch Request:**

   You can submit a batch processing request to the API using the following endpoint:

   ```http
   POST /batch-awaiter
   Content-Type: application/json

   {
     "id": "your-custom-batch-id",
     "webhookUrl": "https://your-webhook-url.com/webhook"
   }
   ```

   This will store the batch request in the database and kick off the processing with OpenAI.

2. **Check Batch Status:**

   The application will automatically check the status of all batches in progress every minute. When a batch is completed, the specified webhook URL will be called with the results.

### Configuration

- **Batch Status Checking Interval:**
  - The batch status checking interval is set to run every minute using a cron job. You can adjust this interval by modifying the `CronExpression` in `batch-status-checker.scheduler.ts`.

- **Database Configuration:**
  - The application uses SQLite by default. If you want to switch to another database, update the TypeORM configuration in `app.module.ts`.

### Deployment

When deploying this application, ensure that your SQLite database is either persisted across deployments or switch to a more robust database like PostgreSQL for production environments.

### Contributing

If you want to contribute to this project, feel free to open a pull request or issue on GitHub.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgements

- **OpenAI** for providing the Batch API.
- **NestJS** for the robust and flexible framework.
