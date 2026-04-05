FROM flyway/flyway:12.0-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY migrations /flyway/sql
USER appuser
