# Architecture

```text
                    OSINT HUB WEB
                         |
              +----------+----------+
              |                     |
        Resource catalog       Search UI
              |                     |
       OSINT Framework       FastAPI /api
                                    |
                              Sherlock engine
                                    |
                              public site data
```

The first milestone keeps upstream code isolated. Later milestones can normalize the OSINT Framework catalog into a searchable API and add separate modules for other data types without modifying Sherlock's core.
