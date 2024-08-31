# OpenAI Batch Processing with NestJS

Welcome to the **OpenAI Batch Processing with NestJS** project! This open-source project is designed to simplify and automate batch processing tasks with OpenAI's Batch API. By leveraging the power of NestJS and SQLite, this application efficiently manages batch requests, periodically checks their status, and automatically triggers webhooks to notify you when your batches are completed. The best part? It’s self-hosted and easily deployable with Docker.

## How It Works

This application is a self-hosted solution that automates the entire lifecycle of OpenAI batch processing:

1. **Batch Request Submission**: Submit batch requests via a simple API.
2. **Status Monitoring**: The application periodically checks the status of all submitted batches using OpenAI's Batch API.
3. **Webhook Notification**: When a batch completes, a webhook is automatically triggered to notify you with the results, ensuring you stay informed without manual checks.
4. **Persistence**: All data is stored in an SQLite database, ensuring your batch requests are persistent across deployments.

## Key Features

- **Automated Batch Management**: Submit, monitor, and manage your OpenAI batch requests with ease.
- **Webhook Notifications**: Receive real-time updates via webhooks as soon as your batches are completed.
- **Self-Hosted**: Easily deploy and run the application on your infrastructure with Docker.
- **Open Source**: Fully open source, allowing you to customize and extend the application to fit your needs.
- **Simple Setup**: Uses SQLite for persistent storage, making it easy to set up without additional dependencies.

## Project Structure

```bash
src/
├── batch-awaiter/
│   ├── batch-awaiter.service.ts        # Handles storing and processing batch requests
│   ├── batch-awaiter.controller.ts     # Exposes an API to submit batch requests
│   ├── batch.entity.ts                 # Defines the BatchEntity for TypeORM
│   ├── batch-awaiter.module.ts         # Module for batch-related services and controllers
├── batch-status/
│   ├── batch-status-checker.service.ts # Periodically checks the status of batches via OpenAI's API
│   ├── batch-status-checker.scheduler.ts # Schedules regular status checks for batches
├── call-webhook/
│   ├── call-webhook.service.ts         # Handles webhook notifications when batches complete
│   ├── call-webhook.scheduler.ts       # Schedules webhook calls based on batch completion
├── app.module.ts                       # Main application module
```

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed.
- **SQLite**: SQLite is used for the database, included with most Node.js installations.
- **Docker**: For easy deployment and self-hosting.

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
   SQLITE_DATABASE_URL=./database.sqlite
   ```

4. **Run the application:**

   ```bash
   npm run start:dev
   ```

### Usage

1. **Submit a Batch Request:**

   Use the following API endpoint to submit a batch processing request:

   ```http
   POST /batch-awaiter
   Content-Type: application/json

   {
     "id": "your-custom-batch-id",
     "webhookUrl": "https://your-webhook-url.com/webhook"
   }
   ```

   This will store the batch request in the database and initiate the processing with OpenAI.

2. **Monitor Batch Status:**

   The application automatically checks the status of all batches every minute. When a batch completes, it triggers the specified webhook URL with the results.

### Docker Deployment

To easily deploy the application using Docker:

1. **Build the Docker image:**

   ```bash
   docker build -t openai-batch-processor .
   ```

2. **Run the Docker container:**

   ```bash
   docker run -d -p 3000:3000 --env-file .env openai-batch-processor
   ```

   This will run the application in a Docker container, making it accessible at `http://localhost:3000`.

### Configuration

- **Batch Status Checking Interval:**
  - By default, the application checks batch statuses every minute. You can adjust this interval by modifying the `CronExpression` in `batch-status-checker.scheduler.ts`.

- **Database Configuration:**
  - The application uses SQLite by default, but you can switch to another database by updating the TypeORM configuration in `app.module.ts`.

### Contributing

We welcome contributions! If you’d like to contribute to this project, feel free to fork the repository, make changes, and submit a pull request. If you find any issues, please open an issue on GitHub.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgements

- **OpenAI** for providing the Batch API.
- **NestJS** for the robust and flexible framework that powers this application.
