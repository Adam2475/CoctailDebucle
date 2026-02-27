FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY CoctailDebucle.Server/CoctailDebucle.Server.csproj CoctailDebucle.Server/
RUN dotnet restore CoctailDebucle.Server/CoctailDebucle.Server.csproj

COPY . .
WORKDIR /src/CoctailDebucle.Server
RUN dotnet publish CoctailDebucle.Server.csproj -c Release -o /app/publish /p:UseAppHost=false /p:BuildProjectReferences=false /p:IncludeClientProjectReference=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "CoctailDebucle.Server.dll"]
