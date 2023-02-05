module.exports = {
  apps : [{
    name: 'server',
    script: './index.js',
    instances: 1,
    out_file: './logs/out',
    error_file: './logs/error',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
  }]
}
